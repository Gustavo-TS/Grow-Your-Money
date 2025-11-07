<template>
  <div class="chart-wrapper">
    <canvas ref="c"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import api from '@/services/apis';

export default {
  name: 'GraficoDespesas',
  props: {
    month: { type: Number, default: () => new Date().getMonth() }, // 0-11
    year: { type: Number, default: () => new Date().getFullYear() }
  },
  data() {
    return {
      chart: null,
      labels: [],
      expenseValues: [],
      incomeValues: [],
      netCumulative: []
    };
  },
  mounted() {
    this.loadAndRender();
  },
  watch: {
    month() { this.loadAndRender(); },
    year() { this.loadAndRender(); }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  },
  methods: {
    async loadAndRender() {
      try {
        const { data } = await api.get('/transacoes');
        const list = this.normalizeList(data);

        const dim = this.daysInMonth(this.year, this.month);
        const expenses = Array.from({ length: dim }, () => 0);
        const incomes = Array.from({ length: dim }, () => 0);

        for (let i = 0; i < list.length; i++) {
          const tx = list[i];
          const rawDate = tx.data || tx.date;
          const d = rawDate ? new Date(rawDate) : null;
          if (!d || isNaN(d.getTime())) continue;
          if (d.getFullYear() !== this.year || d.getMonth() !== this.month) continue;

          const baseVal = (tx.valor !== undefined && tx.valor !== null) ? tx.valor : tx.amount;
          const v = Math.abs(Number(baseVal) || 0);
          const idx = d.getDate() ;
          if (idx < 0 || idx >= dim) continue;

          if (this.isExpense(tx)) expenses[idx] += v;
          else if (this.isIncome(tx)) incomes[idx] += v;
        }

        const net = [];
        let acc = 0;
        for (let i = 0; i < dim; i++) {
          acc += (incomes[i] - expenses[i]);
          net.push(acc);
        }

        this.expenseValues = expenses;
        this.incomeValues = incomes;
        this.netCumulative = net;
        this.labels = Array.from({ length: dim }, (_, i) => String(i + 1).padStart(2, '0'));

        if (!this.chart) this.buildChart();
        else this.updateChart();
      } catch (err) {
        console.error('Erro ao carregar gráfico de despesas/ganhos:', err);
      }
    },
    normalizeList(data) {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.content)) return data.content;
      if (data && Array.isArray(data.transacoes)) return data.transacoes;
      return [];
    },
    daysInMonth(year, month0) {
      return new Date(year, month0 + 1, 0).getDate();
    },
    isExpense(tx) {
      const tipo = (tx.tipo || tx.type || (tx.categoria && tx.categoria.tipo) || '').toString().toLowerCase();
      return ['despesa', 'expense', 'gasto', 'saída', 'saida'].some(t => tipo.includes(t));
    },
    isIncome(tx) {
      const tipo = (tx.tipo || tx.type || (tx.categoria && tx.categoria.tipo) || '').toString().toLowerCase();
      return ['ganho', 'income', 'entrada', 'receita'].some(t => tipo.includes(t));
    },
    buildChart() {
      const el = this.$refs.c;
      if (!el) return;
      const ctx = el.getContext('2d');

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              type: 'bar',
              label: 'Gastos (R$)',
              data: this.expenseValues,
              backgroundColor: '#dc3545',  // vermelho claro
              borderColor: '#dc3545',
              borderWidth: 1,
              borderRadius: 4,
              order: 2
            },
            {
              type: 'bar',
              label: 'Ganhos (R$)',
              data: this.incomeValues,
              backgroundColor: '#28a745', // verde claro
              borderColor: '#4ade80',
              borderWidth: 1,
              borderRadius: 4,
              order: 2
            },
            {
              type: 'line',
              label: 'Saldo acumulado (R$)',
              data: this.netCumulative,
              borderColor: '#ffffff',                       // linha branca
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3,
              pointBackgroundColor: '#ffffff',
              yAxisID: 'y',
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: { bar: { borderSkipped: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#ffffff' }                   // rótulos brancos
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.18)', drawBorder: false }, // grid clara
              ticks: {
                color: '#ffffff',
                callback: (v) =>
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
              }
            }
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff', usePointStyle: true, boxWidth: 10 }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255,255,255,0.25)',
              borderWidth: 1,
              callbacks: {
                label: (ctx) => {
                  const val = (ctx.parsed && typeof ctx.parsed.y === 'number') ? ctx.parsed.y : 0;
                  return ` ${ctx.dataset.label}: ` + Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }
              }
            }
          }
        }
      });
    },
    updateChart() {
      if (!this.chart) return;
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.expenseValues;
      this.chart.data.datasets[1].data = this.incomeValues;
      this.chart.data.datasets[2].data = this.netCumulative;
      this.chart.update();
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  height: 36vh;     
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 8px 10px 4px 10px;
}
.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>