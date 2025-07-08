<template>
  <v-dialog
    :value="dialog"
    persistent
    max-width="500px"
    @input="$emit('update:dialog', $event)"
  >
    <v-card>
      <v-card-title>{{ isEdit ? 'Edit' : 'New' }} Todo</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.title"
          ref="title"
          label="Title"
          autofocus
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" text @click="onSubmit">
          {{ isEdit ? 'Update' : 'Add' }}
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
  computed: {
    isEdit() {
      return !!this.todo;
    }
  },
  data() {
    return {
      form: { title: '' }
    };
  },
  watch: {
    todo: {
      immediate: true,
      handler(v) {
        this.form = v ? { ...v } : { title: '' };
      }
    }
  },
  methods: {
    onSubmit() {
      if (!this.form.title.trim()) {
        alert("Todo title cannot be empty");
        return;
      }
      this.$emit('save', { ...this.form });
    }
  }
};
</script>
