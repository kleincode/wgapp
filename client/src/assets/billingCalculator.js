const payments = {
    John: 400,
    Jane: 1000,
    Bob: 100,
    Dave: 900,
  };

function splitPayments(payments) {
    const people = Object.keys(payments);
    const valuesPaid = Object.values(payments);

    const sum = valuesPaid.reduce((acc, curr) => curr + acc);
    const mean = sum / people.length;

    const sortedPeople = people.sort((personA, personB) => payments[personA] - payments[personB]);
    const sortedValuesPaid = sortedPeople.map((person) => payments[person] - mean);

    let i = 0;
    let j = sortedPeople.length - 1;
    let debt;

    while (i < j) {
        debt = Math.min(-(sortedValuesPaid[i]), sortedValuesPaid[j]);
        sortedValuesPaid[i] += debt;
        sortedValuesPaid[j] -= debt;

        console.log(`${sortedPeople[i]} owes ${sortedPeople[j]} $${debt}`);

        if (sortedValuesPaid[i] === 0) {
        i++;
        }

        if (sortedValuesPaid[j] === 0) {
        j--;
        }
    }
}