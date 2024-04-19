type IStore = Record<number, number>;
interface IOrder {
    id: number;
    s: (keyof IStore)[];
    p: `s${1 | 2}`;
}
interface IResult {
    store: IStore;
    miss: number;
    set: { id: number; size: keyof IStore }[];
}
const store: IStore = {
    1: 2,
    2: 1,
    3: 1,
};

const order: IOrder[] = [
    { id: 1, s: [1, 2], p: 's2' },
    { id: 2, s: [2, 3], p: 's1' },
    { id: 3, s: [1, 3], p: 's1' },
];

let prevResult: IResult[] = [{ store: { ...store }, set: [], miss: 0 }];

const calcOrder = (id: number, size: keyof IStore, priority: number, results: IResult[]) => {
    prevResult.forEach(r => {
        if (r.store[size] - 1 < 0) return;
        const newStore = { ...r.store };
        newStore[size] = r.store[size] - 1;
        results.push({ set: [...r.set, { id, size }], store: newStore, miss: r.miss + (!priority ? 1 : 0) });
    });
};

const processPair = (order: IOrder) => {
    const results: IResult[] = [];
    const prior = +order.p.charAt(1);
    const orders = order;
    const id = orders.id;

    orders.s.forEach((s, i) => {
        calcOrder(id, s, i + 1 == prior ? 1 : 0, results);
    });

    prevResult = results;
};

for (let i = 0; i < order.length; i++) {
    processPair(order[i]);
}

prevResult = prevResult.sort((a, b) => a.miss - b.miss);

console.log(store);
console.log(prevResult, prevResult[0].set, prevResult[1].set);

// for (let i = 1; i < orders.s)

