// Classe que cria e atualiza observadores
class Observable {

    constructor() {
        this.observers = []
    }

    subscribe(f) {
        this.observers.push(f)
    }

    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f)
    }

    notify(data) {
        this.observers.forEach(observer => observer(data))
    }

}

const observer = new Observable()
export { observer }