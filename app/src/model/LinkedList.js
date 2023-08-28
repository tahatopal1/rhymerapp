// Node class
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// LinkedList class
export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Add a node to the end of the linked list
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  // Delete a node with a specific value
  delete(value) {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (currentNode.next.value === value) {
        currentNode.next = currentNode.next.next;
        if (!currentNode.next.next) {
          this.tail = currentNode;
        }
        this.length--;
        return;
      }
      currentNode = currentNode.next;
    }
  }

  // Search for a node with a specific value
  find(value) {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  // Print the linked list
  printList() {
    const array = [];
    let currentNode = this.head;
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    console.log(array);
  }
}

// Example usage
// const myLinkedList = new LinkedList();
// myLinkedList.append(5);
// myLinkedList.append(10);
// myLinkedList.append(15);
// myLinkedList.prepend(1);

// myLinkedList.printList(); // [1, 5, 10, 15]

// myLinkedList.delete(5);
// myLinkedList.printList(); // [1, 10, 15]

// const foundNode = myLinkedList.find(10);
// console.log(foundNode); // Node { value: 10, next: Node { value: 15, next: null } }
