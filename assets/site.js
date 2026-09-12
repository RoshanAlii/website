function calculateCost(values) {
  const {attempts, accepted, calls, callCost, minutes, hourly, other} = values;
  if (!Object.values(values).every(Number.isFinite) || Object.values(values).some(v => v < 0)) throw new Error('Enter valid, non-negative numbers in every field.');
  if (!Number.isInteger(attempts) || attempts < 1 || !Number.isInteger(accepted) || !Number.isInteger(calls)) throw new Error('Attempted outcomes and calls must be whole numbers; enter at least one attempted outcome.');
  if (accepted > attempts) throw new Error('Accepted outcomes cannot exceed attempted outcomes.');
  const model = calls * callCost;
  const human = minutes / 60 * hourly;
  const total = model + human + other;
  return {model, human, total, unit: accepted ? total / accepted : null, rate: accepted / attempts * 100};
}
const form = document.getElementById('cost-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const unit = document.getElementById('unit-result');
  const note = document.getElementById('result-note');
  const ids = {attempts:'attempts',accepted:'accepted',calls:'calls',callCost:'call-cost',minutes:'minutes',hourly:'hourly',other:'other'};
  try {
    const values = Object.fromEntries(Object.entries(ids).map(([name,id])=>[name,document.getElementById(id).value === '' ? NaN : Number(document.getElementById(id).value)]));
    const result = calculateCost(values);
    const currency = document.getElementById('currency').value;
    const money = value => `${currency} ${value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    unit.textContent = result.unit === null ? 'Not defined' : money(result.unit);
    document.getElementById('model-result').textContent = money(result.model);
    document.getElementById('human-result').textContent = money(result.human);
    document.getElementById('total-result').textContent = money(result.total);
    document.getElementById('acceptance-result').textContent = result.rate.toFixed(1) + '%';
    note.textContent = result.unit === null ? 'No outcomes were accepted. Cost per accepted outcome cannot be calculated.' : 'Estimate for the inputs above. Changing the currency label does not convert values.';
  } catch (error) {
    unit.textContent = 'Check your inputs';
    for (const id of ['model-result','human-result','total-result','acceptance-result']) document.getElementById(id).textContent = '—';
    note.textContent = error.message;
  }
});
document.querySelectorAll('.print-button').forEach(button=>button.addEventListener('click',()=>window.print()));
