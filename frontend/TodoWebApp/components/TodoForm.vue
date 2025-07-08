<template>
  <v-form v-model="isValid" ref="form" @submit.prevent="submitForm">
    <v-text-field
      v-model="formData.title"
      label="Title"
      :rules="[v => !!v || 'Title is required']"
      required
    />
    <v-textarea
      v-model="formData.description"
      label="Description"
    />
    <v-select
      v-model="formData.priority"
      :items="priorities"
      label="Priority"
    />
    <v-btn color="primary" :disabled="!isValid" type="submit">
      {{ isEdit ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      default: () => ({ title: '', description: '', priority: 'None' }),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: { ...this.todo },
      isValid: false,
      priorities: ['None', 'Low', 'Medium', 'High'],
    };
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.formData);
    },
  },
};
</script>
