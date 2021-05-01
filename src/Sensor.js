export class Sensor {
    id;
    name;
    values;
    type;

    constructor(id, name, value, type) {
        this.id = id;
        this.name = name;
        this.values = [value];
        this.type = type;
    }

    addValue(value) {
        this.values.push(value);
    }

    lastValue() {
        return this.values[this.values.length - 1];
    }

    lastNValues(nbValues) {
        return this.values.slice(-nbValues);
    }

    print(value) {
        switch (this.type) {
            case 'PERCENT':
                return Math.round(value * 100) + ' %';
            case 'TEMPERATURE':
                return Math.round(value) + ' °';
            case 'OPEN_CLOSE':
                return value === 'OPEN' ? 'Ouvert' : 'Fermé';
        }
    }

}
