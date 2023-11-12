import { Queue } from './Queue.js'

var nGoat; // total num of goat
var nLion; // total num of lion

export function getSolution(goat, lion) {
    const root = 'L' + goat + lion + '00'; // raft, goatLeft, lionLeft, goatRight, lionRight
    const endNode = 'R00' + goat + lion;
    nGoat = goat;
    nLion = lion;

    const visitedNodes = new Map();
    const enqueuedNodes = new Map();
    var parent = new Map();
    var found = false;

    const queue = new Queue();
    queue.enqueue(root);

    while (queue.getSize()) {
        const currentNode = queue.dequeue();
        visitedNodes.set(currentNode);

        if (currentNode == endNode) {
            found = true;
            console.log("Found!");
            return backtrace(parent, root, endNode);
        }

        const nextNodes = addNextNodes(currentNode);

        // get nodes that have not been visited
        const unvisitedNodes = nextNodes.filter((node) => !visitedNodes.has(node) && !enqueuedNodes.has(node));

        // enqueue unvisited nodes
        unvisitedNodes.forEach((node) => {
            queue.enqueue(node);
            enqueuedNodes.set(node);
            parent.set(node, currentNode);
        });

        if (!queue.getSize() && !found) {
            return null;
        }
    }
}

function addNextNodes(currentNode) {

    const raft = currentNode.charAt(0);
    const goatLeft = parseInt(currentNode.charAt(1));
    const lionLeft = parseInt(currentNode.charAt(2));
    const goatRight = parseInt(currentNode.charAt(3));
    const lionRight = parseInt(currentNode.charAt(4));
    const nextNodes = [];

    if (raft == "L") {
        nextNodes.push("R" + (goatLeft - 1) + lionLeft + (goatRight + 1) + lionRight); // move 1 goat to right
        nextNodes.push("R" + (goatLeft - 2) + lionLeft + (goatRight + 2) + lionRight); // move 2 goat to right
        nextNodes.push("R" + (goatLeft - 1) + (lionLeft - 1) + (goatRight + 1) + (lionRight + 1)); // move 1 goat 1 lion to right
        nextNodes.push("R" + goatLeft + (lionLeft - 1) + goatRight + (lionRight + 1)); // move 1 lion to right
        nextNodes.push("R" + goatLeft + (lionLeft - 2) + goatRight + (lionRight + 2)); // move 2 lion to right
        // nextNodes.push("R" + goatLeft + lionLeft + goatRight + lionRight); // no moves
    } else {
        nextNodes.push("L" + (goatLeft + 1) + lionLeft + (goatRight - 1) + lionRight); // move 1 goat to left
        nextNodes.push("L" + (goatLeft + 2) + lionLeft + (goatRight - 2) + lionRight); // move 2 goat to left
        nextNodes.push("L" + (goatLeft + 1) + (lionLeft + 1) + (goatRight - 1) + (lionRight - 1)); // move 1 goat 1 lion to left
        nextNodes.push("L" + goatLeft + (lionLeft + 1) + goatRight + (lionRight - 1)); // move 1 lion to left
        nextNodes.push("L" + goatLeft + (lionLeft + 2) + goatRight + (lionRight - 2)); // move 2 lion to left    
        // nextNodes.push("L" + goatLeft + lionLeft + goatRight + lionRight); // no moves
    }

    const validNodes = nextNodes.filter((node) => checkBoundary(node) && checkRules(node));
    return validNodes;
}

// check if animals are between 0 and 3
function checkBoundary(node) {
    var outOfBounds = false;
    var isGoat = true;

    for (let i = 1; i < 5; i++) {
        if (parseInt(node.charAt(i)) > (isGoat ? nGoat : nLion) || isNaN(parseInt(node.charAt(i)))) {
            outOfBounds = true;
            break;
        }

        isGoat = !isGoat;
    }

    return !outOfBounds;
}

// check if goats are safe (>= lions)
function checkRules(node) {
    const goatLeft = parseInt(node.charAt(1));
    const lionLeft = parseInt(node.charAt(2));
    const goatRight = parseInt(node.charAt(3));
    const lionRight = parseInt(node.charAt(4));

    if (goatLeft == 0) {
        return (goatRight >= lionRight);
    }

    if (goatRight == 0) {
        return (goatLeft >= lionLeft);
    }
    return (goatLeft >= lionLeft && goatRight >= lionRight);
}

// backtrace and return path taken to reach solution
function backtrace(parent, root, endNode) {
    var path = [];
    var currentNode = endNode;

    while (currentNode != root) {
        path.unshift(currentNode);
        currentNode = parent.get(currentNode);
    }

    path.unshift(root);
    return path;
}