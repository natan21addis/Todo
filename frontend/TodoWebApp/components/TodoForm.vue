<template>
  <v-dialog
    :value="dialog"
    persistent
    max-width="500px"
    @input="$emit('update:dialog', $event)"
  >
    <v-card class="todo-dialog">
      <v-card-title class="d-flex align-center">
        <v-icon left color="primary">{{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
        <span>{{ isEdit ? 'Edit Todo Item' : 'Create New Todo' }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <v-form ref="form" @submit.prevent="onSubmit">
          <!-- Title Field -->
          <v-text-field
            v-model="form.title"
            ref="title"
            label="Task Title"
            placeholder="What needs to be done?"
            outlined
            dense
            autofocus
            :rules="titleRules"
            counter="100"
            class="mb-3"
          ></v-text-field>

          <!-- Description Field -->
          <v-textarea
            v-model="form.description"
            label="Details"
            placeholder="Add description (optional)"
            outlined
            dense
            rows="2"
            counter="250"
            auto-grow
            class="mb-3"
          ></v-textarea>

          <!-- Due Date Picker -->
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.dueDate"
                label="Due Date"
                placeholder="Select date (optional)"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
                clearable
                @click:clear="form.dueDate = null"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.dueDate"
              no-title
              scrollable
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          text
          @click="closeDialog"
          class="text--secondary"
        >
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          depressed
          @click="onSubmit"
          :loading="saving"
        >
          <v-icon left>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
          {{ isEdit ? 'Update Task' : 'Add Task' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    todo: Object
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        dueDate: null
      },
      dateMenu: false,
      saving: false,
      titleRules: [
        v => !!v.trim() || 'Title is required',
        v => (v && v.length <= 100) || 'Max 100 characters'
      ]
    };
  },
  computed: {
    isEdit() {
      return !!this.todo;
    }
  },
  watch: {
    todo: {
      immediate: true,
      handler(v) {
        this.form = v ? { ...v } : {
          title: '',
          description: '',
          dueDate: null
        };

        // Reset validation when form changes
        if (this.$refs.form) {
          this.$refs.form.resetValidation();
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.form = {
        title: '',
        description: '',
        dueDate: null
      };
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) {
        return;
      }

      try {
        this.saving = true;
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.$emit('save', { ...this.form });
        this.resetForm();
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.todo-dialog {
  border-radius: 8px !important;
}
.v-card__title {
  background-color: #f5f7fa;
  padding: 16px 24px;
}
</style>
