<template>
  <div class="upsert-page">
    <TransactionForm :id="id" @saved="goBack" @cancel="goBack" />
  </div>
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';

export default {
  name: 'TransactionUpsertPage',
  components: { TransactionForm },
  props: { id: { type: [String, Number], default: null } },
  computed: { isEdit() { return !!this.id; } },
  methods: {
    goBack() { this.$router.push('/transactions'); }
  }
};
</script> 