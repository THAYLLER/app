require('intl'); // import intl object
require('intl/locale-data/jsonp/pt-BR'); // load the required locale details

export default class Formatters {
  static NumberFormatter = (val) => {
    if (val > 0) {
      const saldo = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 });
      const balanceStr = saldo.format(val);
      return balanceStr.toString();
    }
    if (val.toString().substr(0, 1) === '-') {
      const saldo = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 });
      const value = Number(val.toString().substr(1));
      const balanceStr = saldo.format(value);
      return `- ${balanceStr}`;
    }
    return val.toString();
  }

  static Currency(curr) {
    // console.log('curr :>> ', curr);
    // const number = curr.toString();
    // const num = `${number.substr(0, number.length - 2)}.${number.substr(number.length - 2, number.length)}`;
    const format = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
    return format.format(curr);
  }
}
