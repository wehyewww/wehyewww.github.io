import { LinkedList } from './LinkedList.js'

export class Queue extends LinkedList {
    constructor(head, size) {
        super(head, size);
    }

    enqueue(value) {
        this.append(value);
    }

    dequeue() {
        return this.removeFromFront();
    }

    peek() {
        return this.head.value;
    }
}