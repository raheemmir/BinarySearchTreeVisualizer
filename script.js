let nodeId = 0; // unique identifier for the nodes 

// Class for the nodes
class Node {
    constructor(key) {
        this.key = key;
        this.id = nodeId++
        this.left = null;
        this.right = null;
    }
}

// Class for the binary search tree
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    insert(key) {
        const newNode = new Node(key);
        if (this.root == null) {
            this.root = newNode;
        }
        else {
            this.insertNode(this.root, newNode);
        }
    }
    insertNode(currNode, newNode) {
        if(newNode.key < currNode.key) {
            if (currNode.left === null) {
                currNode.left = newNode;
            }
            else {
                this.insertNode(currNode.left, newNode);
            }
        }
        else {
            if (currNode.right === null) {
                currNode.right = newNode;
            }
            else {
                this.insertNode(currNode.right, newNode);
            }
        }
    }
    delete(key) {
        this.root = this.deleteNode(this.root, key);
    }
    deleteNode(currNode, key) {
        if (currNode === null) {
            return null;
        }
        else if (key < currNode.key) {
            currNode.left = this.deleteNode(currNode.left, key);
            return currNode;
        }
        else if (key > currNode.key) {
            currNode.right = this.deleteNode(currNode.right, key);
            return currNode;
        }
        else {
            // deleting a leaf node
            if (currNode.left === null && currNode.right === null) {
                currNode = null;
                return currNode;
            }
            // deleting a node with only one child
            else if (currNode.left === null) {
                currNode = currNode.right;
                return currNode;
            }
            else if (currNode.right === null) {
                currNode = currNode.left;
                return currNode;
            }
            // deleting a node with two children
            // replace with leftmost node of its right subtree
            else {
                const minKey = this.findMinVal(currNode.right);
                currNode.key = minKey;
                currNode.right = this.deleteNode(currNode.right, minKey);
                return currNode;
            }
        }
    }
    findMinVal(currNode) {
        if(currNode.left === null) {
            return currNode.key;
        }
        else {
            return this.findMinVal(currNode.left);
        }
    }
    inOrder(root, order = [], keys = []) {
        if (root !== null) {
            this.inOrder(root.left, order, keys);
            order.push(root.id);
            keys.push(root.key);
            this.inOrder(root.right, order, keys);
        }
        if (root === this.root) console.log(keys);
        return order;
    }
    preOrder(root, order = [], keys = []) {
        if (root !== null) {
            order.push(root.id);
            keys.push(root.key);
            this.preOrder(root.left, order, keys);
            this.preOrder(root.right, order, keys);
        }
        if (root === this.root) console.log(keys);
        return order;
    }
    postOrder(root, order = [], keys = []) {
        if (root !== null) {
            this.postOrder(root.left, order, keys);
            this.postOrder(root.right, order, keys);
            order.push(root.id);
            keys.push(root.key);
        }
        if (root === this.root) console.log(keys);
        return order;
    }
    treeSize(root) {
        if (root == null) {
            return 0;
        }
        else {
            return 1 + this.treeSize(root.left) + this.treeSize(root.right)
        }
    }
    treeDepth(root) {
        if (root == null) {
            return 0;
        }
        else {
            return 1 + Math.max(this.treeDepth(root.left), this.treeDepth(root.right));
        }
    }
}

const bst = new BinarySearchTree();

// Event listening for buttons

document.getElementById('insert-btn').addEventListener('click', function() {
    const userInput = parseInt(document.getElementById('insert-node').value, 10);
    if (!isNaN(userInput)) {
        bst.insert(userInput); 
        updateVisualization();
        console.log(`Inserted ${userInput}:`, bst);
    }
    else {
        alert('Please enter a number');
    }
});

document.getElementById('delete-btn').addEventListener('click', function() {
    const userInput = parseInt(document.getElementById('delete-node').value, 10);
    if (!isNaN(userInput)) {
        if (bst.root === null) {
            alert('The tree is empty, there is nothing to delete.');
        }
        else {
            bst.delete(userInput); 
            updateVisualization();
            console.log(`Deleted ${userInput}:`, bst);
        }
    }
    else {
        alert('Please enter a number');
    }
});

document.getElementById('in-order-btn').addEventListener('click', function() {
    const inOrder = bst.inOrder(bst.root);
    visualizeTraversal(inOrder);
});

document.getElementById('pre-order-btn').addEventListener('click', function() {
    const preOrder = bst.preOrder(bst.root);
    visualizeTraversal(preOrder);
});

document.getElementById('post-order-btn').addEventListener('click', function() {
    const postOrder = bst.postOrder(bst.root);
    visualizeTraversal(postOrder);
});

document.getElementById('reset-btn').addEventListener('click', function() {
    bst.root = null; // should reset the tree
    resetTree();
});

function updateVisualization() {
    const nodeWidth = 40; 
    const nodeHeight = 40; 
    const verticalSpacing = 90;
    const baseHorizontalSpacing = 25; 

    const treeContainer = document.getElementById('tree-svg');
    treeContainer.innerHTML = '';

    function calculateHorizontalSpacing(level, maxDepth) {
        return baseHorizontalSpacing * Math.pow(2, maxDepth - level);
    }

    function drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'black');
        // so lines appear behind circles:
        treeContainer.insertBefore(line, treeContainer.firstChild); 
    }

    function drawNode(node, x, y, level, maxDepth) {
        if (!node) return;

        const horizontalSpacing = calculateHorizontalSpacing(level, maxDepth);

        if (node.left) {
            const leftX = x - horizontalSpacing;
            const leftY = y + verticalSpacing;
            drawLine(x, y, leftX, leftY);
            drawNode(node.left, leftX, leftY, level + 1, maxDepth);
        }

        if (node.right) {
            const rightX = x + horizontalSpacing;
            const rightY = y + verticalSpacing;
            drawLine(x, y, rightX, rightY);
            drawNode(node.right, rightX, rightY, level + 1, maxDepth);
        }

        const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nodeElement.setAttribute('cx', x);
        nodeElement.setAttribute('cy', y);
        nodeElement.setAttribute('r', nodeWidth / 2);
        nodeElement.setAttribute('stroke', 'black');
        nodeElement.setAttribute('fill', 'white');
        nodeElement.setAttribute('key', node.key)
        nodeElement.setAttribute('id', `node-${node.id}`) // unique id
        treeContainer.appendChild(nodeElement);

        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y + 7);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.textContent = node.key;
        treeContainer.appendChild(textElement);
    }

    const maxDepth = 4;
    const rootX = treeContainer.clientWidth / 2;
    const rootY = 50;
    drawNode(bst.root, rootX, rootY, 1, maxDepth);
}

function resetTree() {
    const treeContainer = document.getElementById('tree-svg');
    treeContainer.innerHTML = '';
}

function visualizeTraversal(order) {
    disableTraversalButtons(); // disable buttons during animations
    const delay = 750; // milliseconds
    order.forEach((nodeId, index) => {
        setTimeout(() => highlightNode(nodeId), index * delay);
    });

    setTimeout(() => {
        clearHighlights();
        enableTraversalButtons();
    }, order.length * delay);
}

function highlightNode(nodeID) {
    clearHighlights();
    const nodeElement = document.querySelector(`#node-${nodeID}`);
    if (nodeElement) {
        nodeElement.style.fill = 'yellow';
    }
}

function clearHighlights() {
    nodeElements = document.querySelectorAll('circle');
    nodeElements.forEach(node => {
        node.style.fill = 'white'; // revert back to default color
    });
}

function disableTraversalButtons() {
    document.getElementById('in-order-btn').disabled = true;
    document.getElementById('pre-order-btn').disabled = true;
    document.getElementById('post-order-btn').disabled = true;
}

function enableTraversalButtons() {
    document.getElementById('in-order-btn').disabled = false;
    document.getElementById('pre-order-btn').disabled = false;
    document.getElementById('post-order-btn').disabled = false;
}
