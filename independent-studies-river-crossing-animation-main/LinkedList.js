class Node {
    constructor(value) {
        this.value = value;
        this.next = null; // pointer to next node
    }
}

export class LinkedList {
    constructor() {
        this.head = null; // pointer to first node (null when empty list)
        this.tail = null; // pointer to last node
        this.size = 0;
    }

    isEmpty() {
        return this.size == 0;
    }

    getSize() {
        return this.size;
    }

    /**
     * - Creates new node with given value
     * - If list is empty, simply point head to new node
     * - If list is not empty, point new node.next to current head, then point head to new node
     */
    prepend(value) { // constant time complexity
        const node = new Node(value);
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head = node;
        }
        this.size++;
    }

    /**
     * - Create new node with given value
     * - If list is empty, simply point head to new node
     * - If list is not empty, traverse through list to reach last node
     * - Point last node.next to new node
     * - New node.next is null by default
     */
    append(value) { // constant time complexity
        const node = new Node(value);
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.size++;
    }

    removeFromFront() { // constant time complexity
        if (this.isEmpty()) {
            return null;
        }
        const value = this.head.value;
        if (this.size == 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
        }
        this.size--;
        return value;
    }

    removeFromEnd() { // linear time complexity
        if (this.isEmpty()) {
            return null;
        }
        const value = this.tail.value;
        if (this.size == 1) {
            this.head = null;
            this.tail = null;
        } else {
            var prev = this.head;
            while (prev.next != this.tail) {
                prev = prev.next;
            }
            prev.next = null;
            this.tail = prev;
        }
        this.size--;
        return value;
    }

    /**
     * - Create new node with given value
     * - Point prev to current head
     * - Advance prev till its on index before insertion
     * - Point node.next to prev.next
     * - Point prev.next to new node
     */
    insert(value, index) {
        if (index < 0 || index > this.size) {
            return;
        }
        if (index == 0) { // adding node at index 0 is same as prepend
            this.prepend(value);
        } else if (index == this.size) { // adding node at this index is same as append
            this.append(value);
        } else {
            const node = new Node(value);
            var prev = this.head;

            for (let i = 0; i < index - 1; i++) {
                prev = prev.next;
            }
            node.next = prev.next;
            prev.next = node;
            this.size++;
        }
    }

    /**
     * - If index is not valid, return null
     * - If index is 0, point head to head.next
     * - Otherwise, point prev to node before given index
     * - Point prev.next to node after the removedNode
     */
    removeByIndex(index) {
        var removedNode;

        if (index < 0 || index >= this.size) {
            return null;
        }

        if (index == 0) {
            return this.removeFromFront();
        } else if (index == this.size - 1) {
            return this.removeFromEnd();
        } else {
            var prev = this.head;

            for (let i = 0; i < index - 1; i++) {
                prev = prev.next;
            }
            removedNode = prev.next;
            prev.next = removedNode.next;
        }
        this.size--;
        return removedNode.value;
    }

    removeByValue(value) {
        if (this.isEmpty()) {
            return null;
        }

        if (this.head.value == value) {
            return this.removeFromFront();
        } else if (this.tail.value == value) {
            return this.removeFromEnd();
        } else {
            var prev = this.head;

            while (prev.next && prev.next.value != value) {
                prev = prev.next;
            }

            if (prev.next) {
                var removedNode = prev.next;
                prev.next = removedNode.next;
                this.size--;
                return value;
            }
        }
    }

    /**
     * - Return -1 if list is empty or value does not exist
     * - Traverse list till matching value is found
     */
    search(value) {
        if (this.isEmpty()) {
            return -1;
        }

        var i = 0;
        var curr = this.head;

        while (curr != null) {

            if (curr.value == value) {
                return i;
            }
            curr = curr.next;
            i++;
        }
        return -1;
    }

    reverse() {
        var prev = null;
        var curr = this.head;

        while (curr != null) {
            var next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        this.head = prev;
    }

    print() {
        if (this.isEmpty()) {
            console.log('List is empty!');
        } else {
            var curr = this.head; // current pointer starts at head
            var listValues = '';

            while (curr != null) {
                listValues += `${curr.value} ` // add value of node to values list
                curr = curr.next; // point current pointer to next node
            }
            console.log(listValues);
        }
    }
}