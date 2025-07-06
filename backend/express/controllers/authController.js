const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  hasuraEndpoint,
  hasuraAdminSecret,
  jwtSecret,
  jwtExpireTime,
} = require("../config");

async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
      data: null,
    });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const query = {
      query: `mutation InsertUser($email: String!, $password_hash: String!) {
        insert_users_one(object: {email: $email, password_hash: $password_hash}) {
          id
          email
        }
      }`,
      variables: { email, password_hash },
    };

    const response = await axios.post(hasuraEndpoint, query, {
      headers: { "x-hasura-admin-secret": hasuraAdminSecret },
    });

    if (!response.data.data?.insert_users_one) {
      // Check if the error is due to duplicate email
      if (
        response.data.errors &&
        response.data.errors.some(
          (err) => err.extensions?.code === "constraint-violation"
        )
      ) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
          data: null,
        });
      }
      throw new Error("User creation failed - no data returned");
    }

    const user = response.data.data.insert_users_one;
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": user.id,
        },
      },
      jwtSecret,
      { expiresIn: jwtExpireTime }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle unique constraint violation specifically
    if (
      err.response?.data?.errors?.some(
        (e) => e.extensions?.code === "constraint-violation"
      )
    ) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        data: null,
      });
    }

    return res.status(400).json({
      success: false,
      message: "User registration failed",
      error: err.response?.data?.errors?.[0]?.message || err.message,
      data: null,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
      data: null,
    });
  }

  try {
    // 1. Case-insensitive email lookup
    const response = await axios.post(
      hasuraEndpoint,
      {
        query: `query GetUser($email: String!) {
          users(where: {email: {_ilike: $email}}, limit: 1) { 
            id 
            email
            password_hash 
          }
        }`,
        variables: { email },
      },
      { headers: { "x-hasura-admin-secret": hasuraAdminSecret } }
    );

    const user = response.data.data.users[0];

    // 2. Better error messages
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    // 3. Debug password comparison
    const match = await bcrypt.compare(password, user.password_hash);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Password mismatch for user:", user.email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    // 4. Consistent token generation with registration
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": user.id,
        },
      },
      jwtSecret,
      { expiresIn: jwtExpireTime }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.response?.data?.errors?.[0]?.message || err.message,
      data: null,
    });
  }
}

module.exports = { register, login };
