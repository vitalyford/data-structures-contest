import type { Problem } from './problems';

export const problemsB: Problem[] = [
  // ══════════════════════════════════════════════════
  // STACKS
  // ══════════════════════════════════════════════════
  {
    id: 'stack-b-01',
    topic: 'stacks',
    difficulty: 'easy',
    points: 5,
    type: 'drag-order',
    en: {
      title: 'Stack Trace Challenge II',
      teaching: `A **stack** uses **LIFO — Last In, First Out**. Each push adds to the top; each pop removes from the top. Trace every operation carefully — letters that were popped are **gone** and must not appear in the final answer.`,
      description: `An empty stack goes through **12 operations**:\n\n1. push(A)\n2. push(B)\n3. push(C)\n4. pop()\n5. push(D)\n6. pop()\n7. pop()\n8. push(E)\n9. push(F)\n10. pop()\n11. push(G)\n12. push(H)\n\n**Drag the items into the correct slots to show the final stack state (bottom → top).** The pool contains all letters that were pushed — some are red herrings.`,
      data: {
        pool: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        slots: 4,
        slotLabels: ['Slot 1 (Bottom)', 'Slot 2', 'Slot 3', 'Slot 4 (Top)'],
      },
    },
    zh: {
      title: '栈追踪挑战 II',
      teaching: `**栈**遵循**后进先出（LIFO）**原则。每次压栈在顶部添加元素；每次弹栈从顶部移除元素。仔细追踪每个操作——已弹出的字母**已消失**，不得出现在最终答案中。`,
      description: `一个空栈经过 **12 次操作**：\n\n1. push(A)\n2. push(B)\n3. push(C)\n4. pop()\n5. push(D)\n6. pop()\n7. pop()\n8. push(E)\n9. push(F)\n10. pop()\n11. push(G)\n12. push(H)\n\n**将元素拖入正确的槽位，显示最终栈状态（底部 → 顶部）。** 候选池包含所有被压入过的字母——其中有些是干扰项。`,
      data: {
        pool: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        slots: 4,
        slotLabels: ['槽 1（底部）', '槽 2', '槽 3', '槽 4（顶部）'],
      },
    },
    // Trace: [A]→[A,B]→[A,B,C]→[A,B]→[A,B,D]→[A,B]→[A]→[A,E]→[A,E,F]→[A,E]→[A,E,G]→[A,E,G,H]
    answer: ['A', 'E', 'G', 'H'],
  },

  {
    id: 'stack-b-02',
    topic: 'stacks',
    difficulty: 'easy',
    points: 5,
    type: 'drag-match',
    en: {
      title: 'Operation → Final State Matcher II',
      teaching: `Trace each sequence one step at a time. **push(x)** adds x on top; **pop()** removes the top item (gone forever). All five sequences use the **same letters X, Y, Z** — you must trace carefully rather than matching by letter alone.`,
      description: `Each row on the left is a sequence of stack operations starting from an **empty stack**. Drag it to the matching final stack state on the right.\n\n**All sequences use letters X, Y, Z.**`,
      data: {
        left: [
          'push(X), push(Y), push(Z), pop(), pop()',
          'push(Z), push(X), push(Y), pop()',
          'push(Y), push(X), pop(), push(Z), pop()',
          'push(X), push(Z), pop(), push(Y), push(Z)',
          'push(Y), pop(), push(X), push(Z), pop(), push(Y)',
        ],
        right: [
          'Stack: [Z, X]',
          'Stack: [X, Y]',
          'Stack: [X, Y, Z]',
          'Stack: [Y]',
          'Stack: [X]',
        ],
      },
    },
    zh: {
      title: '操作序列 → 最终状态匹配 II',
      teaching: `逐步追踪每个序列。**push(x)** 将 x 添加到顶部；**pop()** 移除顶部元素（永久消失）。所有五个序列使用**相同的字母 X、Y、Z**——必须仔细追踪，而不能仅凭字母匹配。`,
      description: `左侧每行是从**空栈**开始的操作序列。将其拖到右侧对应的最终栈状态。\n\n**所有序列使用字母 X、Y、Z。**`,
      data: {
        left: [
          'push(X), push(Y), push(Z), pop(), pop()',
          'push(Z), push(X), push(Y), pop()',
          'push(Y), push(X), pop(), push(Z), pop()',
          'push(X), push(Z), pop(), push(Y), push(Z)',
          'push(Y), pop(), push(X), push(Z), pop(), push(Y)',
        ],
        right: [
          'Stack: [Z, X]',
          'Stack: [X, Y]',
          'Stack: [X, Y, Z]',
          'Stack: [Y]',
          'Stack: [X]',
        ],
      },
    },
    // Seq1: []→[X]→[X,Y]→[X,Y,Z]→[X,Y]→[X]                    result: Stack: [X]       → right[4]
    // Seq2: []→[Z]→[Z,X]→[Z,X,Y]→[Z,X]                         result: Stack: [Z, X]    → right[0]
    // Seq3: []→[Y]→[Y,X]→[Y]→[Y,Z]→[Y]                         result: Stack: [Y]       → right[3]
    // Seq4: []→[X]→[X,Z]→[X]→[X,Y]→[X,Y,Z]                     result: Stack: [X, Y, Z] → right[2]
    // Seq5: []→[Y]→[]→[X]→[X,Z]→[X]→[X,Y]                      result: Stack: [X, Y]    → right[1]
    answer: {
      'push(X), push(Y), push(Z), pop(), pop()': 'Stack: [X]',
      'push(Z), push(X), push(Y), pop()': 'Stack: [Z, X]',
      'push(Y), push(X), pop(), push(Z), pop()': 'Stack: [Y]',
      'push(X), push(Z), pop(), push(Y), push(Z)': 'Stack: [X, Y, Z]',
      'push(Y), pop(), push(X), push(Z), pop(), push(Y)': 'Stack: [X, Y]',
    },
  },

  {
    id: 'stack-b-03',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'drag-order',
    en: {
      title: 'Recursive Call Stack',
      teaching: `**Recursive functions** build a call stack one frame deeper with each call. Each frame stays on the stack until its function returns. The deepest call (the **base case**) is at the top.\n\nFor \`factorial(n)\`:\n- It calls \`factorial(n-1)\`, which calls \`factorial(n-2)\`, and so on\n- The stack grows until it hits \`factorial(1)\` (the base case)`,
      description: `A program computes \`factorial(4)\`.\n\nExecution:\n1. \`main()\` calls \`factorial(4)\`\n2. \`factorial(4)\` calls \`factorial(3)\`\n3. \`factorial(3)\` calls \`factorial(2)\`\n4. \`factorial(2)\` calls \`factorial(1)\` — base case reached\n\n**Drag the frames into the correct call stack order (bottom = first called, top = currently running).**`,
      data: {
        pool: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
        slots: 5,
        slotLabels: ['Bottom (first called)', 'Frame 2', 'Frame 3', 'Frame 4', 'Top (currently running)'],
      },
    },
    zh: {
      title: '递归调用栈',
      teaching: `**递归函数**每次调用都会向调用栈中添加一个更深的帧。每个帧留在栈上，直到其函数返回。最深的调用（**基本情况**）位于顶部。\n\n对于 \`factorial(n)\`：\n- 它调用 \`factorial(n-1)\`，后者再调用 \`factorial(n-2)\`，依此类推\n- 栈一直增长，直到遇到 \`factorial(1)\`（基本情况）`,
      description: `程序计算 \`factorial(4)\`。\n\n执行过程：\n1. \`main()\` 调用 \`factorial(4)\`\n2. \`factorial(4)\` 调用 \`factorial(3)\`\n3. \`factorial(3)\` 调用 \`factorial(2)\`\n4. \`factorial(2)\` 调用 \`factorial(1)\` — 到达基本情况\n\n**将帧拖入正确的调用栈顺序（底部 = 最先调用，顶部 = 当前运行）。**`,
      data: {
        pool: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
        slots: 5,
        slotLabels: ['底部（最先调用）', '帧 2', '帧 3', '帧 4', '顶部（当前运行）'],
      },
    },
    answer: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
  },

  {
    id: 'stack-b-04',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'multi-choice',
    en: {
      title: 'Stack Snapshot Quiz II',
      teaching: `Trace through all operations step by step, keeping your mental picture of the stack current after each step.\n\n- **push(x)** → places x on top\n- **pop()** → removes and discards the top item\n\nThe stack grows upward — the last item pushed and **not yet popped** is always on top.`,
      description: `Starting with an empty stack, trace all 10 operations:\n\n| Step | Operation |\n|------|-----------|\n| 1 | push(3) |\n| 2 | push(7) |\n| 3 | push(1) |\n| 4 | push(9) |\n| 5 | pop() |\n| 6 | pop() |\n| 7 | push(4) |\n| 8 | pop() |\n| 9 | push(6) |\n| 10 | push(2) |\n\n**What does the stack look like after all 10 operations?**`,
      data: {
        options: [
          { id: 'A', text: 'Bottom: 3, Top: 7 — two items' },
          { id: 'B', text: 'Bottom: 3, then 7, then 1, Top: 6 — four items' },
          { id: 'C', text: 'Bottom: 3, then 7, then 4, Top: 6 — four items' },
          { id: 'D', text: 'Bottom: 3, then 7, then 6, Top: 2 — four items' },
        ],
      },
    },
    zh: {
      title: '栈快照测验 II',
      teaching: `逐步追踪所有操作，每步后更新脑海中的栈状态。\n\n- **push(x)** → 将 x 放在顶部\n- **pop()** → 移除并丢弃顶部元素\n\n栈向上增长——最后一个被压入且**尚未弹出**的元素始终在顶部。`,
      description: `从空栈开始，追踪所有 10 步操作：\n\n| 步骤 | 操作 |\n|------|------|\n| 1 | push(3) |\n| 2 | push(7) |\n| 3 | push(1) |\n| 4 | push(9) |\n| 5 | pop() |\n| 6 | pop() |\n| 7 | push(4) |\n| 8 | pop() |\n| 9 | push(6) |\n| 10 | push(2) |\n\n**执行全部 10 步操作后，栈的状态是什么？**`,
      data: {
        options: [
          { id: 'A', text: '底部：3，顶部：7 — 两个元素' },
          { id: 'B', text: '底部：3，然后 7，然后 1，顶部：6 — 四个元素' },
          { id: 'C', text: '底部：3，然后 7，然后 4，顶部：6 — 四个元素' },
          { id: 'D', text: '底部：3，然后 7，然后 6，顶部：2 — 四个元素' },
        ],
      },
    },
    // Trace: [3]→[3,7]→[3,7,1]→[3,7,1,9]→[3,7,1]→[3,7]→[3,7,4]→[3,7]→[3,7,6]→[3,7,6,2]
    answer: 'D',
  },

  {
    id: 'stack-b-05',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'multi-choice',
    en: {
      title: 'Infix to Postfix Conversion',
      teaching: `**Postfix notation** (Reverse Polish Notation) eliminates parentheses by placing the operator **after** its operands.\n\nAlgorithm using a stack:\n1. Read tokens left to right.\n2. If operand (number/variable): output it immediately.\n3. If operator: pop and output all stack operators with **higher or equal precedence**, then push the new operator. Precedence: * and / beat + and -.\n4. At the end: pop and output everything remaining on the stack.\n\n**Example:** \`2 + 3\` → \`2 3 +\`\n**Example:** \`2 + 3 * 4\` → \`2 3 4 * +\` (multiplication before addition)`,
      description: `Convert the infix expression to postfix notation:\n\n**\`3 + 4 * 2 - 1\`**\n\n*(Standard operator precedence: \`*\` and \`/\` bind more tightly than \`+\` and \`-\`)*`,
      data: {
        options: [
          { id: 'A', text: '3 4 + 2 * 1 -' },
          { id: 'B', text: '3 4 2 * + 1 -' },
          { id: 'C', text: '3 4 2 + * 1 -' },
          { id: 'D', text: '3 4 2 * 1 - +' },
        ],
      },
    },
    zh: {
      title: '中缀转后缀',
      teaching: `**后缀表示法**（逆波兰表示法）通过将运算符置于操作数**之后**来消除括号。\n\n使用栈的算法：\n1. 从左到右读取标记。\n2. 若为操作数（数字/变量）：立即输出。\n3. 若为运算符：弹出并输出栈中所有**优先级更高或相等**的运算符，然后将新运算符压栈。优先级：* 和 / 高于 + 和 -。\n4. 最后：将栈中剩余所有元素弹出并输出。\n\n**示例：** \`2 + 3\` → \`2 3 +\`\n**示例：** \`2 + 3 * 4\` → \`2 3 4 * +\`（乘法先于加法）`,
      description: `将中缀表达式转换为后缀表示法：\n\n**\`3 + 4 * 2 - 1\`**\n\n*（标准运算符优先级：\`*\` 和 \`/\` 比 \`+\` 和 \`-\` 绑定更紧）*`,
      data: {
        options: [
          { id: 'A', text: '3 4 + 2 * 1 -' },
          { id: 'B', text: '3 4 2 * + 1 -' },
          { id: 'C', text: '3 4 2 + * 1 -' },
          { id: 'D', text: '3 4 2 * 1 - +' },
        ],
      },
    },
    // 3 + (4*2) - 1: output 3, push +, output 4, push *(higher than +), output 2,
    // pop * → output *, pop + → output +, push -, output 1, pop - → output -
    // Result: 3 4 2 * + 1 -
    answer: 'B',
  },

  {
    id: 'stack-b-06',
    topic: 'stacks',
    difficulty: 'hard',
    points: 15,
    type: 'checkbox-multi',
    en: {
      title: 'Pop Sequence Validator II',
      teaching: `Items 1, 2, 3, 4, 5, 6 are pushed **one at a time in order**. Between any two pushes you may pop as many times as you like. The key constraints:\n- You can never pop an item that has not been pushed yet\n- The stack is LIFO — you must always pop the **most recently pushed** item first\n\n**Strategy:** For each candidate sequence, simulate it step by step. A sequence is invalid if you ever need to pop an item that isn't currently on top.`,
      description: `Items are pushed onto a stack in order: **1, 2, 3, 4, 5, 6** (one at a time).\n\nWhich of the following pop sequences are **possible**? Check all that apply.`,
      data: {
        options: [
          { id: 'A', text: '[6, 5, 4, 3, 2, 1]' },
          { id: 'B', text: '[2, 4, 1, 3, 5, 6]' },
          { id: 'C', text: '[3, 2, 5, 4, 6, 1]' },
          { id: 'D', text: '[3, 4, 2, 6, 5, 1]' },
          { id: 'E', text: '[1, 4, 3, 2, 5, 6]' },
          { id: 'F', text: '[3, 5, 2, 6, 4, 1]' },
        ],
      },
    },
    zh: {
      title: '弹出序列验证器 II',
      teaching: `元素 1、2、3、4、5、6 **按顺序逐一压栈**。在任意两次压栈之间可以多次弹栈。关键约束：\n- 不能弹出尚未压入的元素\n- 栈遵循后进先出——必须始终弹出**最近压入**的元素\n\n**策略：** 对每个候选序列逐步模拟。若某时刻需要弹出的元素不在栈顶，则该序列无效。`,
      description: `元素按顺序压栈：**1, 2, 3, 4, 5, 6**（逐一压入）。\n\n以下哪些弹出序列是**可能的**？选择所有符合条件的选项。`,
      data: {
        options: [
          { id: 'A', text: '[6, 5, 4, 3, 2, 1]' },
          { id: 'B', text: '[2, 4, 1, 3, 5, 6]' },
          { id: 'C', text: '[3, 2, 5, 4, 6, 1]' },
          { id: 'D', text: '[3, 4, 2, 6, 5, 1]' },
          { id: 'E', text: '[1, 4, 3, 2, 5, 6]' },
          { id: 'F', text: '[3, 5, 2, 6, 4, 1]' },
        ],
      },
    },
    // A: push all then pop all in reverse ✓
    // B: push1,2 pop2; push3,4 pop4; stack=[1,3] → need pop1 but top=3 ✗
    // C: push1,2,3 pop3,2; push4,5 pop5,4; push6 pop6,1 ✓
    // D: push1,2,3 pop3; push4 pop4; pop2; push5,6 pop6,5; pop1 ✓
    // E: push1 pop1; push2,3,4 pop4,3,2; push5,6 pop5(need push5 then pop5)... push5 pop5; push6 pop6 ✓
    //    E trace: push1 pop1; push2,3,4; pop4,3,2; push5; pop5; push6; pop6 ✓
    // F: push1,2,3 pop3; push4,5 pop5; stack=[1,2,4] → need pop2 but top=4 ✗
    answer: ['A', 'C', 'D', 'E'],
  },

  {
    id: 'stack-b-07',
    topic: 'stacks',
    difficulty: 'hard',
    points: 15,
    type: 'click-bug',
    en: {
      title: 'Bug Hunt: Iterative DFS',
      teaching: `Iterative DFS uses an **explicit stack** instead of recursion. The algorithm:\n1. Push the start node.\n2. While the stack is not empty: pop a node.\n3. If it hasn't been visited: mark it visited and push all its unvisited neighbors.\n\nA common bug is **returning the wrong variable** at the end — the result should be the list of visited nodes, not the stack itself.`,
      description: `The function below has **exactly one bug**. Click the line number that contains the bug.\n\n\`\`\`java\n1:  public List<Integer> dfs(Graph g, int start) {\n2:      List<Integer> visited = new ArrayList<>();\n3:      Stack<Integer> stack = new Stack<>();\n4:      stack.push(start);\n5:      while (!stack.isEmpty()) {\n6:          int node = stack.pop();\n7:          if (visited.contains(node)) continue;\n8:          visited.add(node);\n9:          for (int neighbor : g.neighbors(node)) {\n10:             stack.push(neighbor);\n11:         }\n12:     }\n13:     return stack;\n14: }\n\`\`\``,
      data: {
        lines: 14,
        bugLine: 13,
      },
    },
    zh: {
      title: '漏洞猎手：迭代式 DFS',
      teaching: `迭代 DFS 使用**显式栈**代替递归。算法步骤：\n1. 将起始节点压栈。\n2. 当栈非空时：弹出一个节点。\n3. 若该节点未访问：标记已访问，将所有未访问邻居压栈。\n\n常见的错误是最后**返回了错误的变量**——结果应该是已访问节点的列表，而不是栈本身。`,
      description: `下面的函数中**恰好有一个漏洞**。点击包含漏洞的行号。\n\n\`\`\`java\n1:  public List<Integer> dfs(Graph g, int start) {\n2:      List<Integer> visited = new ArrayList<>();\n3:      Stack<Integer> stack = new Stack<>();\n4:      stack.push(start);\n5:      while (!stack.isEmpty()) {\n6:          int node = stack.pop();\n7:          if (visited.contains(node)) continue;\n8:          visited.add(node);\n9:          for (int neighbor : g.neighbors(node)) {\n10:             stack.push(neighbor);\n11:         }\n12:     }\n13:     return stack;\n14: }\n\`\`\``,
      data: {
        lines: 14,
        bugLine: 13,
      },
    },
    // Line 13: returns 'stack' (which is empty after the loop) instead of 'visited'
    answer: 13,
  },

  // ══════════════════════════════════════════════════
  // QUEUES
  // ══════════════════════════════════════════════════
  {
    id: 'queue-b-01',
    topic: 'queues',
    difficulty: 'easy',
    points: 5,
    type: 'drag-order',
    en: {
      title: 'Print Queue Simulator',
      teaching: `A **queue** is FIFO — First In, First Out. Jobs join at the **back** and leave from the **front**. Think of a printer: documents print in the order they were submitted.`,
      description: `Starting from an empty print queue, these operations happen:\n\n1. addJob("Report.pdf")\n2. addJob("Photo.jpg")\n3. addJob("Slides.pptx")\n4. addJob("Notes.txt")\n5. printNext() — first job is printed and removed\n6. addJob("Budget.xlsx")\n7. printNext() — next job is printed and removed\n8. addJob("Invoice.pdf")\n\n**Drag the remaining jobs into the correct queue order (front → back).**`,
      data: {
        pool: ['Report.pdf', 'Photo.jpg', 'Slides.pptx', 'Notes.txt', 'Budget.xlsx', 'Invoice.pdf'],
        slots: 4,
        slotLabels: ['Front (printed next)', 'Slot 2', 'Slot 3', 'Back'],
      },
    },
    zh: {
      title: '打印队列模拟器',
      teaching: `**队列**遵循先进先出（FIFO）原则——任务从**末尾**加入，从**前端**离开。就像打印机：文档按提交顺序打印。`,
      description: `从空打印队列开始，依次发生以下操作：\n\n1. addJob("Report.pdf")\n2. addJob("Photo.jpg")\n3. addJob("Slides.pptx")\n4. addJob("Notes.txt")\n5. printNext() — 第一个任务被打印并移除\n6. addJob("Budget.xlsx")\n7. printNext() — 下一个任务被打印并移除\n8. addJob("Invoice.pdf")\n\n**将剩余任务拖入正确的队列顺序（队首 → 队尾）。**`,
      data: {
        pool: ['Report.pdf', 'Photo.jpg', 'Slides.pptx', 'Notes.txt', 'Budget.xlsx', 'Invoice.pdf'],
        slots: 4,
        slotLabels: ['队首（下一个打印）', '槽 2', '槽 3', '队尾'],
      },
    },
    // addJob 4 jobs → [Report,Photo,Slides,Notes]; printNext removes Report → [Photo,Slides,Notes]
    // addJob Budget → [Photo,Slides,Notes,Budget]; printNext removes Photo → [Slides,Notes,Budget]
    // addJob Invoice → [Slides,Notes,Budget,Invoice]
    answer: ['Slides.pptx', 'Notes.txt', 'Budget.xlsx', 'Invoice.pdf'],
  },

  {
    id: 'queue-b-02',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'click-sequence',
    en: {
      title: 'BFS Click Traversal II',
      teaching: `**BFS** visits nodes **layer by layer** using a queue. When you enqueue a node, mark it visited immediately to avoid processing it twice.\n\nKey insight: nodes at the same depth are processed in the order they were enqueued. When two nodes share the same depth, the one enqueued first is visited first.`,
      description: `Perform **BFS starting from node A** on the directed graph below.\n\nClick nodes **in the order BFS would visit them**. Adjacency list (visit in listed order):\n- A → [B, C]\n- B → [D, E]\n- C → [E, F]\n- D → [G]\n- E → [G, H]\n- F → [H]\n\n*(E and H appear in multiple adjacency lists — BFS visits each node only once.)*`,
      data: {
        nodes: [
          { id: 'A', x: 220, y: 30 },
          { id: 'B', x: 100, y: 140 },
          { id: 'C', x: 340, y: 140 },
          { id: 'D', x: 30,  y: 270 },
          { id: 'E', x: 180, y: 270 },
          { id: 'F', x: 380, y: 270 },
          { id: 'G', x: 90,  y: 390 },
          { id: 'H', x: 270, y: 390 },
        ],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
          { from: 'C', to: 'E' }, { from: 'C', to: 'F' },
          { from: 'D', to: 'G' },
          { from: 'E', to: 'G' }, { from: 'E', to: 'H' },
          { from: 'F', to: 'H' },
        ],
        directed: true,
      },
    },
    zh: {
      title: 'BFS 点击遍历 II',
      teaching: `**BFS** 使用队列**逐层**访问节点。入队节点时立即标记为已访问，避免重复处理。\n\n关键点：处于同一深度的节点按入队顺序处理。若两节点深度相同，先入队的先被访问。`,
      description: `在下面的有向图中，从**节点 A 开始执行 BFS**。\n\n按 BFS 访问节点的顺序**依次点击节点**。邻接表（按所列顺序访问）：\n- A → [B, C]\n- B → [D, E]\n- C → [E, F]\n- D → [G]\n- E → [G, H]\n- F → [H]\n\n*（E 和 H 出现在多个邻接表中——BFS 每个节点只访问一次。）*`,
      data: {
        nodes: [
          { id: 'A', x: 220, y: 30 },
          { id: 'B', x: 100, y: 140 },
          { id: 'C', x: 340, y: 140 },
          { id: 'D', x: 30,  y: 270 },
          { id: 'E', x: 180, y: 270 },
          { id: 'F', x: 380, y: 270 },
          { id: 'G', x: 90,  y: 390 },
          { id: 'H', x: 270, y: 390 },
        ],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
          { from: 'C', to: 'E' }, { from: 'C', to: 'F' },
          { from: 'D', to: 'G' },
          { from: 'E', to: 'G' }, { from: 'E', to: 'H' },
          { from: 'F', to: 'H' },
        ],
        directed: true,
      },
    },
    // BFS: enqueue A (visited)
    // Process A: enqueue B(v), C(v) → Queue: [B,C]
    // Process B: enqueue D(v), E(v) → Queue: [C,D,E]
    // Process C: E already visited, enqueue F(v) → Queue: [D,E,F]
    // Process D: enqueue G(v) → Queue: [E,F,G]
    // Process E: G already visited, enqueue H(v) → Queue: [F,G,H]
    // Process F: H already visited → Queue: [G,H]
    // Process G → Queue: [H]
    // Process H → done
    answer: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  },

  {
    id: 'queue-b-03',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'drag-priority',
    en: {
      title: 'OS Process Scheduler',
      teaching: `An **OS process scheduler** uses a priority queue to decide which process runs next. Higher priority numbers mean more urgent — the scheduler always picks the highest-priority **runnable** process first.\n\nReal-time and system processes have higher priority than user or background tasks.`,
      description: `Seven processes are waiting to run. **Drag them into the correct scheduling order (highest priority first).**\n\n| Process | Type | Priority |\n|---------|------|----------|\n| P1 | System | 8 |\n| P2 | User | 3 |\n| P3 | Background | 1 |\n| P4 | Real-time | 9 |\n| P5 | User | 5 |\n| P6 | Interactive | 7 |\n| P7 | System | 6 |`,
      data: {
        patients: [
          { name: 'P1', condition: 'System', urgency: 8 },
          { name: 'P2', condition: 'User', urgency: 3 },
          { name: 'P3', condition: 'Background', urgency: 1 },
          { name: 'P4', condition: 'Real-time', urgency: 9 },
          { name: 'P5', condition: 'User', urgency: 5 },
          { name: 'P6', condition: 'Interactive', urgency: 7 },
          { name: 'P7', condition: 'System', urgency: 6 },
        ],
      },
    },
    zh: {
      title: '操作系统进程调度器',
      teaching: `**操作系统进程调度器**使用优先队列决定下一个运行的进程。优先级数字越高表示越紧急——调度器始终优先选择优先级最高的**可运行**进程。\n\n实时和系统进程的优先级高于用户或后台任务。`,
      description: `七个进程等待运行。**将它们拖入正确的调度顺序（最高优先级优先）。**\n\n| 进程 | 类型 | 优先级 |\n|---------|------|----------|\n| P1 | 系统 | 8 |\n| P2 | 用户 | 3 |\n| P3 | 后台 | 1 |\n| P4 | 实时 | 9 |\n| P5 | 用户 | 5 |\n| P6 | 交互 | 7 |\n| P7 | 系统 | 6 |`,
      data: {
        patients: [
          { name: 'P1', condition: '系统', urgency: 8 },
          { name: 'P2', condition: '用户', urgency: 3 },
          { name: 'P3', condition: '后台', urgency: 1 },
          { name: 'P4', condition: '实时', urgency: 9 },
          { name: 'P5', condition: '用户', urgency: 5 },
          { name: 'P6', condition: '交互', urgency: 7 },
          { name: 'P7', condition: '系统', urgency: 6 },
        ],
      },
    },
    // Sort by priority desc: P4(9), P1(8), P6(7), P7(6), P5(5), P2(3), P3(1)
    answer: ['P4', 'P1', 'P6', 'P7', 'P5', 'P2', 'P3'],
  },

  {
    id: 'queue-b-04',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'drag-match',
    en: {
      title: 'Queue Operations State Match II',
      teaching: `Review the three core queue operations:\n- **enqueue(x)** — adds x at the **back**\n- **dequeue()** — removes the item at the **front**\n- **peek()** — returns the front item **without removing it**\n\nOnly enqueue and dequeue change the queue. peek leaves it unchanged. Multiple operations in a single step are applied in the listed order.`,
      description: `Starting queue (front → back): **[5, 10, 15, 20]**\n\nMatch each operation on the left to the resulting queue state on the right.\n\nDrag each result box to the correct operation.`,
      data: {
        left: [
          { id: 'op1', text: 'enqueue(25)' },
          { id: 'op2', text: 'dequeue(), dequeue()' },
          { id: 'op3', text: 'peek()' },
          { id: 'op4', text: 'dequeue(), enqueue(1), enqueue(2)' },
        ],
        right: [
          { id: 'sA', text: '[5, 10, 15, 20] — unchanged' },
          { id: 'sB', text: '[5, 10, 15, 20, 25]' },
          { id: 'sC', text: '[15, 20]' },
          { id: 'sD', text: '[10, 15, 20, 1, 2]' },
        ],
      },
    },
    zh: {
      title: '队列操作状态匹配 II',
      teaching: `复习三种核心队列操作：\n- **enqueue(x)** — 在**末尾**添加 x\n- **dequeue()** — 移除**队首**元素\n- **peek()** — 返回队首元素**但不移除**\n\n只有入队和出队会改变队列。peek 不改变队列。同一步骤中的多个操作按所列顺序执行。`,
      description: `初始队列（队首 → 队尾）：**[5, 10, 15, 20]**\n\n将左侧的每个操作与右侧对应的队列状态匹配。\n\n将每个结果框拖到对应的操作上。`,
      data: {
        left: [
          { id: 'op1', text: 'enqueue(25)' },
          { id: 'op2', text: 'dequeue(), dequeue()' },
          { id: 'op3', text: 'peek()' },
          { id: 'op4', text: 'dequeue(), enqueue(1), enqueue(2)' },
        ],
        right: [
          { id: 'sA', text: '[5, 10, 15, 20] — 未改变' },
          { id: 'sB', text: '[5, 10, 15, 20, 25]' },
          { id: 'sC', text: '[15, 20]' },
          { id: 'sD', text: '[10, 15, 20, 1, 2]' },
        ],
      },
    },
    answer: { op1: 'sB', op2: 'sC', op3: 'sA', op4: 'sD' },
  },

  {
    id: 'queue-b-05',
    topic: 'queues',
    difficulty: 'hard',
    points: 15,
    type: 'click-cells',
    en: {
      title: 'Circular Queue Index Puzzle II',
      teaching: `A **circular queue** with capacity N uses indices 0 through N-1. Pointers advance using modulo:\n- \`rear = (rear + 1) % capacity\` — after each enqueue\n- \`front = (front + 1) % capacity\` — after each dequeue\n\n**rear always points to the next empty slot** (where the next item will be written); **front always points to the oldest item** (next to be removed).\n\nOccupied slots are those from \`front\` up to (but not including) \`rear\`, wrapping around if rear < front.`,
      description: `A circular queue has capacity **6** (indices 0–5). Starting empty with front=0, rear=0, apply these 13 operations:\n\n1. enqueue("A")\n2. enqueue("B")\n3. enqueue("C")\n4. enqueue("D")\n5. dequeue()\n6. dequeue()\n7. dequeue()\n8. enqueue("E")\n9. enqueue("F")\n10. enqueue("G")\n11. dequeue()\n12. enqueue("H")\n13. enqueue("I")\n\nTrace \`front\` and \`rear\` through all 13 operations. Remember: \`rear = (rear+1)%6\` on enqueue, \`front = (front+1)%6\` on dequeue.\n\n**Click the cell indices (0–5) that are occupied after all 13 operations.**`,
      data: {
        capacity: 6,
        cells: ['?', '?', '?', '?', '?', '?'],
        front: 4,
        rear: 3,
      },
    },
    zh: {
      title: '循环队列索引谜题 II',
      teaching: `容量为 N 的**循环队列**使用索引 0 到 N-1。指针通过取模前进：\n- \`rear = (rear + 1) % capacity\` — 每次入队后\n- \`front = (front + 1) % capacity\` — 每次出队后\n\n**rear 始终指向下一个空槽位**（下次写入的位置）；**front 始终指向最旧的元素**（下次移除的元素）。\n\n已占用的槽位是从 \`front\` 到（不包括）\`rear\` 的位置，如果 rear < front 则需要环绕。`,
      description: `循环队列容量为 **6**（索引 0–5）。从空队列开始，front=0，rear=0，执行以下 13 次操作：\n\n1. enqueue("A")\n2. enqueue("B")\n3. enqueue("C")\n4. enqueue("D")\n5. dequeue()\n6. dequeue()\n7. dequeue()\n8. enqueue("E")\n9. enqueue("F")\n10. enqueue("G")\n11. dequeue()\n12. enqueue("H")\n13. enqueue("I")\n\n追踪所有 13 次操作中的 \`front\` 和 \`rear\`。记住：入队时 \`rear = (rear+1)%6\`，出队时 \`front = (front+1)%6\`。\n\n**点击所有 13 次操作后已被占用的单元格索引（0–5）。**`,
      data: {
        capacity: 6,
        cells: ['?', '?', '?', '?', '?', '?'],
        front: 4,
        rear: 3,
      },
    },
    // Trace (capacity=6):
    // enq A: arr[0]=A f=0 r=1
    // enq B: arr[1]=B f=0 r=2
    // enq C: arr[2]=C f=0 r=3
    // enq D: arr[3]=D f=0 r=4
    // deq: remove arr[0]=A f=1 r=4
    // deq: remove arr[1]=B f=2 r=4
    // deq: remove arr[2]=C f=3 r=4
    // enq E: arr[4]=E f=3 r=5
    // enq F: arr[5]=F f=3 r=0(wrap)
    // enq G: arr[0]=G f=3 r=1
    // deq: remove arr[3]=D f=4 r=1
    // enq H: arr[1]=H f=4 r=2
    // enq I: arr[2]=I f=4 r=3
    // Final: front=4, rear=3; occupied = indices 4(E),5(F),0(G),1(H),2(I)
    answer: [0, 1, 2, 4, 5],
  },

  {
    id: 'queue-b-06',
    topic: 'queues',
    difficulty: 'hard',
    points: 15,
    type: 'click-bug',
    en: {
      title: 'Bug Hunt: Priority Queue removeMax',
      teaching: `A priority queue backed by an **unsorted array** finds the maximum by scanning the whole array in O(n). After finding the max index, the standard removal trick is:\n- Overwrite the max slot with the **last element** (index \`size-1\`)\n- Then decrement \`size\`\n\nThis avoids shifting — just swaps the removed slot with the last item.\n\n**Common off-by-one bug:** looping with \`i <= size\` instead of \`i < size\` reads one element past the end of the valid data.`,
      description: `The function below has **exactly one bug**. Click the line number that contains it.\n\n\`\`\`java\n1:  public int removeMax() {\n2:      if (size == 0) return -1;\n3:      int maxIdx = 0;\n4:      for (int i = 1; i <= size; i++) {\n5:          if (priorities[i] > priorities[maxIdx]) {\n6:              maxIdx = i;\n7:          }\n8:      }\n9:      int result = data[maxIdx];\n10:     data[maxIdx] = data[size - 1];\n11:     priorities[maxIdx] = priorities[size - 1];\n12:     size--;\n13:     return result;\n14: }\n\`\`\``,
      data: {
        lines: 14,
        bugLine: 4,
      },
    },
    zh: {
      title: '漏洞猎手：优先队列 removeMax',
      teaching: `由**无序数组**支持的优先队列通过扫描整个数组以 O(n) 找到最大值。找到最大索引后，标准移除方法是：\n- 用**最后一个元素**（索引 \`size-1\`）覆盖最大值槽位\n- 然后递减 \`size\`\n\n这避免了移位——只是用最后一个元素替换被删除的槽位。\n\n**常见的差一错误：** 使用 \`i <= size\` 而不是 \`i < size\` 循环，会读取有效数据末尾之后的一个元素。`,
      description: `下面的函数中**恰好有一个漏洞**。点击包含漏洞的行号。\n\n\`\`\`java\n1:  public int removeMax() {\n2:      if (size == 0) return -1;\n3:      int maxIdx = 0;\n4:      for (int i = 1; i <= size; i++) {\n5:          if (priorities[i] > priorities[maxIdx]) {\n6:              maxIdx = i;\n7:          }\n8:      }\n9:      int result = data[maxIdx];\n10:     data[maxIdx] = data[size - 1];\n11:     priorities[maxIdx] = priorities[size - 1];\n12:     size--;\n13:     return result;\n14: }\n\`\`\``,
      data: {
        lines: 14,
        bugLine: 4,
      },
    },
    // Line 4: 'i <= size' should be 'i < size' — valid indices are 0..size-1, so loop should stop at i < size
    answer: 4,
  },

  // ══════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════
  {
    id: 'graph-b-01',
    topic: 'graphs',
    difficulty: 'easy',
    points: 5,
    type: 'checkbox-multi',
    en: {
      title: 'Graph Property Classifier II',
      teaching: `Review the four key graph properties:\n- **Directed vs Undirected**: are the edges one-way (arrows) or two-way?\n- **Cyclic vs Acyclic**: is there any path from a node back to itself?\n- **Connected vs Disconnected**: can you reach every node from every other node?\n\nFor directed graphs, "connected" means you can reach any node from any other — if not, it's disconnected.`,
      description: `Study the graph below, then check **all properties that apply**.\n\nGraph: Nodes A, B, C, D, E with undirected edges: A–B, B–C, C–D, D–E, E–B`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 130 },
          { id: 'B', x: 200, y: 60  },
          { id: 'C', x: 340, y: 130 },
          { id: 'D', x: 290, y: 270 },
          { id: 'E', x: 140, y: 270 },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'D' },
          { from: 'D', to: 'E' },
          { from: 'E', to: 'B' },
        ],
        directed: false,
        options: [
          { id: 'directed',      text: 'Directed' },
          { id: 'undirected',    text: 'Undirected' },
          { id: 'cyclic',        text: 'Contains a cycle' },
          { id: 'acyclic',       text: 'Acyclic (no cycle)' },
          { id: 'connected',     text: 'Connected' },
          { id: 'disconnected',  text: 'Disconnected' },
        ],
      },
    },
    zh: {
      title: '图属性分类器 II',
      teaching: `复习四个关键图属性：\n- **有向 vs 无向**：边是单向（带箭头）还是双向？\n- **有环 vs 无环**：是否存在从某节点回到自身的路径？\n- **连通 vs 非连通**：是否可以从任意节点到达所有其他节点？\n\n对于有向图，"连通"意味着可以从任意节点到达任意其他节点——否则为非连通图。`,
      description: `研究下图，然后勾选**所有适用的属性**。\n\n图：节点 A, B, C, D, E，无向边：A–B, B–C, C–D, D–E, E–B`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 130 },
          { id: 'B', x: 200, y: 60  },
          { id: 'C', x: 340, y: 130 },
          { id: 'D', x: 290, y: 270 },
          { id: 'E', x: 140, y: 270 },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'D' },
          { from: 'D', to: 'E' },
          { from: 'E', to: 'B' },
        ],
        directed: false,
        options: [
          { id: 'directed',      text: '有向图' },
          { id: 'undirected',    text: '无向图' },
          { id: 'cyclic',        text: '包含环' },
          { id: 'acyclic',       text: '无环图' },
          { id: 'connected',     text: '连通图' },
          { id: 'disconnected',  text: '非连通图' },
        ],
      },
    },
    // Undirected, cycle B-C-D-E-B, all nodes reachable from A → connected
    answer: ['undirected', 'cyclic', 'connected'],
  },

  {
    id: 'graph-b-02',
    topic: 'graphs',
    difficulty: 'easy',
    points: 5,
    type: 'fill-matrix',
    en: {
      title: 'Directed Adjacency Matrix Builder',
      teaching: `For a **directed graph**, cell [i][j] = **1** if there is an edge **from node i to node j**. Unlike undirected graphs, directed adjacency matrices are **not necessarily symmetric**: edge A→B sets [A][B]=1 but **not** [B][A].\n\n**Example:** For A→B and B→A:\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 1 | 0 |\n\nBut for A→B only:\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 0 | 0 |`,
      description: `Build the adjacency matrix for this **directed** graph.\n\nEdges: **A→B, A→C, B→D, C→D, C→E, D→E**\n\nClick a cell to toggle it between 0 and 1.`,
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' },
          { from: 'C', to: 'D' }, { from: 'C', to: 'E' },
          { from: 'D', to: 'E' },
        ],
        directed: true,
        graphLayout: [
          { id: 'A', x: 150, y: 30  },
          { id: 'B', x: 50,  y: 150 },
          { id: 'C', x: 250, y: 150 },
          { id: 'D', x: 150, y: 270 },
          { id: 'E', x: 150, y: 380 },
        ],
      },
    },
    zh: {
      title: '有向图邻接矩阵构建器',
      teaching: `对于**有向图**，单元格 [i][j] = **1** 表示存在从节点 i **到**节点 j 的边。与无向图不同，有向图的邻接矩阵**不一定对称**：边 A→B 设置 [A][B]=1，但**不**设置 [B][A]。\n\n**示例：** 对于 A→B 和 B→A：\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 1 | 0 |\n\n但仅对于 A→B：\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 0 | 0 |`,
      description: `为这个**有向**图构建邻接矩阵。\n\n边：**A→B, A→C, B→D, C→D, C→E, D→E**\n\n点击单元格在 0 和 1 之间切换。`,
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' },
          { from: 'C', to: 'D' }, { from: 'C', to: 'E' },
          { from: 'D', to: 'E' },
        ],
        directed: true,
        graphLayout: [
          { id: 'A', x: 150, y: 30  },
          { id: 'B', x: 50,  y: 150 },
          { id: 'C', x: 250, y: 150 },
          { id: 'D', x: 150, y: 270 },
          { id: 'E', x: 150, y: 380 },
        ],
      },
    },
    // Directed: A→B=[0,1], A→C=[0,2], B→D=[1,3], C→D=[2,3], C→E=[2,4], D→E=[3,4]
    // Nodes: A=0, B=1, C=2, D=3, E=4
    answer: [[0,1],[0,2],[1,3],[2,3],[2,4],[3,4]],
  },

  {
    id: 'graph-b-03',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'click-sequence',
    en: {
      title: 'DFS Click Traversal II',
      teaching: `**DFS** dives deep along one path before backtracking. With an explicit stack (or recursion), it always follows the first unvisited neighbor.\n\nWhen multiple neighbors are available, always choose the **smallest-numbered** unvisited neighbor first.`,
      description: `Perform **DFS starting from node 1** on the graph below.\n\nAdjacency list (visit smaller numbers first):\n- 1 → [2, 3]\n- 2 → [4, 5]\n- 3 → [6, 7]\n- 4 → [8]\n- 5 → [9]\n- 6, 7, 8, 9 → no further unvisited neighbors\n\nClick nodes **in the order DFS visits them**.`,
      data: {
        nodes: [
          { id: '1', x: 240, y: 30  },
          { id: '2', x: 110, y: 130 },
          { id: '3', x: 370, y: 130 },
          { id: '4', x: 40,  y: 250 },
          { id: '5', x: 180, y: 250 },
          { id: '6', x: 310, y: 250 },
          { id: '7', x: 440, y: 250 },
          { id: '8', x: 40,  y: 360 },
          { id: '9', x: 180, y: 360 },
        ],
        edges: [
          { from: '1', to: '2' }, { from: '1', to: '3' },
          { from: '2', to: '4' }, { from: '2', to: '5' },
          { from: '3', to: '6' }, { from: '3', to: '7' },
          { from: '4', to: '8' },
          { from: '5', to: '9' },
        ],
        directed: false,
      },
    },
    zh: {
      title: 'DFS 点击遍历 II',
      teaching: `**DFS** 在回溯之前沿一条路径深入。使用显式栈（或递归），始终跟随第一个未访问的邻居。\n\n当有多个邻居可用时，始终优先选择**编号最小**的未访问邻居。`,
      description: `在下图中，从**节点 1 开始执行 DFS**。\n\n邻接表（优先访问较小编号）：\n- 1 → [2, 3]\n- 2 → [4, 5]\n- 3 → [6, 7]\n- 4 → [8]\n- 5 → [9]\n- 6, 7, 8, 9 → 无更多未访问邻居\n\n按 DFS 访问节点的顺序**依次点击节点**。`,
      data: {
        nodes: [
          { id: '1', x: 240, y: 30  },
          { id: '2', x: 110, y: 130 },
          { id: '3', x: 370, y: 130 },
          { id: '4', x: 40,  y: 250 },
          { id: '5', x: 180, y: 250 },
          { id: '6', x: 310, y: 250 },
          { id: '7', x: 440, y: 250 },
          { id: '8', x: 40,  y: 360 },
          { id: '9', x: 180, y: 360 },
        ],
        edges: [
          { from: '1', to: '2' }, { from: '1', to: '3' },
          { from: '2', to: '4' }, { from: '2', to: '5' },
          { from: '3', to: '6' }, { from: '3', to: '7' },
          { from: '4', to: '8' },
          { from: '5', to: '9' },
        ],
        directed: false,
      },
    },
    // DFS: 1→2→4→8(bt)→5→9(bt)(bt)→3→6(bt)→7
    answer: ['1', '2', '4', '8', '5', '9', '3', '6', '7'],
  },

  {
    id: 'graph-b-04',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'click-edges',
    en: {
      title: 'Shortest Path Highlighter II',
      teaching: `In a **weighted graph**, each edge has a **cost**. The **shortest path** between two nodes is the route where the **total sum of edge costs is lowest** — it may pass through more nodes than a direct route, but the overall cost is smaller.\n\n**How to think about it:** explore the different routes from source to target, add up the weights along each one, and pick the route with the smallest total.\n\n⚠️ Trap: a path with fewer edges may cost *more* than a longer path with smaller edge weights.`,
      description: `Click on the **edges that form the shortest (minimum-weight) path from A to G** in the graph below.\n\nEdge weights are shown on each edge. Source: **A**, Target: **G**.\n\nEdges: A-B(2), A-C(6), B-C(3), B-D(8), B-E(5), C-E(7), D-F(2), E-D(1), E-F(4), E-G(7), F-G(1)`,
      data: {
        nodes: [
          { id: 'A', x: 50,  y: 200 },
          { id: 'B', x: 170, y: 80  },
          { id: 'C', x: 170, y: 320 },
          { id: 'D', x: 310, y: 80  },
          { id: 'E', x: 310, y: 230 },
          { id: 'F', x: 440, y: 130 },
          { id: 'G', x: 560, y: 230 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 2 },
          { id: 'A-C', from: 'A', to: 'C', weight: 6 },
          { id: 'B-C', from: 'B', to: 'C', weight: 3 },
          { id: 'B-D', from: 'B', to: 'D', weight: 8 },
          { id: 'B-E', from: 'B', to: 'E', weight: 5 },
          { id: 'C-E', from: 'C', to: 'E', weight: 7 },
          { id: 'D-F', from: 'D', to: 'F', weight: 2 },
          { id: 'E-D', from: 'E', to: 'D', weight: 1 },
          { id: 'E-F', from: 'E', to: 'F', weight: 4 },
          { id: 'E-G', from: 'E', to: 'G', weight: 7 },
          { id: 'F-G', from: 'F', to: 'G', weight: 1 },
        ],
        directed: false,
        source: 'A',
        target: 'G',
      },
    },
    zh: {
      title: '最短路径高亮器 II',
      teaching: `在**加权图**中，每条边都有一个**代价**。两个节点之间的**最短路径**是**边权总和最小**的路径——它可能经过更多的节点，但总代价更低。\n\n**思路：** 探索从源节点到目标节点的不同路径，将每条路径上的权重相加，选择总和最小的那条。\n\n⚠️ 陷阱：边数更少的路径代价可能*更高*——如果那些边的权重较大的话。`,
      description: `点击下图中**从 A 到 G 的最短（最小权重）路径上的边**。\n\n每条边上显示了边权。源节点：**A**，目标节点：**G**。\n\n边：A-B(2), A-C(6), B-C(3), B-D(8), B-E(5), C-E(7), D-F(2), E-D(1), E-F(4), E-G(7), F-G(1)`,
      data: {
        nodes: [
          { id: 'A', x: 50,  y: 200 },
          { id: 'B', x: 170, y: 80  },
          { id: 'C', x: 170, y: 320 },
          { id: 'D', x: 310, y: 80  },
          { id: 'E', x: 310, y: 230 },
          { id: 'F', x: 440, y: 130 },
          { id: 'G', x: 560, y: 230 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 2 },
          { id: 'A-C', from: 'A', to: 'C', weight: 6 },
          { id: 'B-C', from: 'B', to: 'C', weight: 3 },
          { id: 'B-D', from: 'B', to: 'D', weight: 8 },
          { id: 'B-E', from: 'B', to: 'E', weight: 5 },
          { id: 'C-E', from: 'C', to: 'E', weight: 7 },
          { id: 'D-F', from: 'D', to: 'F', weight: 2 },
          { id: 'E-D', from: 'E', to: 'D', weight: 1 },
          { id: 'E-F', from: 'E', to: 'F', weight: 4 },
          { id: 'E-G', from: 'E', to: 'G', weight: 7 },
          { id: 'F-G', from: 'F', to: 'G', weight: 1 },
        ],
        directed: false,
        source: 'A',
        target: 'G',
      },
    },
    // Dijkstra from A:
    // A=0; process A: B=2, C=6
    // process B(2): C=min(6,5)=5, D=10, E=7
    // process C(5): E=min(7,12)=7 (no change)
    // process E(7): D=min(10,8)=8, F=min(∞,11)=11, G=min(∞,14)=14
    // process D(8): F=min(11,10)=10
    // process F(10): G=min(14,11)=11
    // process G(11): done
    // Path: G←F(10)←D(8)←E(7)←B(2)←A  →  A-B, B-E, E-D, D-F, F-G
    answer: ['A-B', 'B-E', 'E-D', 'D-F', 'F-G'],
  },

  {
    id: 'graph-b-05',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'checkbox-multi',
    en: {
      title: 'Cycle Detector Challenge II',
      teaching: `A **cycle** in a directed graph requires following the edge directions. A path A→B→C→A is a cycle; A→B→C with no way back is not.\n\nIn an undirected graph, revisiting any node through a different edge constitutes a cycle.\n\n**Strategy:** For each graph, try to find a cycle or prove none exists.`,
      description: `Which of the following 6 graphs contain a **cycle**? Check all that apply.`,
      data: {
        graphs: [
          {
            id: 'g1', label: 'Graph 1',
            nodes: [{ id: 'A', x: 40, y: 40 }, { id: 'B', x: 210, y: 40 }, { id: 'C', x: 125, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }],
            directed: true,
          },
          {
            id: 'g2', label: 'Graph 2',
            nodes: [{ id: 'A', x: 30, y: 80 }, { id: 'B', x: 130, y: 20 }, { id: 'C', x: 230, y: 80 }, { id: 'D', x: 130, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'B' }],
            directed: true,
          },
          {
            id: 'g3', label: 'Graph 3',
            nodes: [{ id: 'A', x: 30, y: 80 }, { id: 'B', x: 130, y: 20 }, { id: 'C', x: 230, y: 80 }, { id: 'D', x: 130, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'D' }, { from: 'C', to: 'D' }],
            directed: true,
          },
          {
            id: 'g4', label: 'Graph 4',
            nodes: [{ id: 'A', x: 40, y: 40 }, { id: 'B', x: 210, y: 40 }, { id: 'C', x: 125, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }],
            directed: true,
          },
          {
            id: 'g5', label: 'Graph 5',
            nodes: [{ id: 'A', x: 30, y: 100 }, { id: 'B', x: 110, y: 20 }, { id: 'C', x: 190, y: 100 }, { id: 'D', x: 280, y: 60 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }, { from: 'C', to: 'D' }],
            directed: true,
          },
          {
            id: 'g6', label: 'Graph 6',
            nodes: [{ id: 'A', x: 20, y: 40 }, { id: 'B', x: 90, y: 100 }, { id: 'C', x: 160, y: 40 }, { id: 'D', x: 230, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }],
            directed: true,
          },
        ],
        options: [
          { id: 'g1', text: 'Graph 1' },
          { id: 'g2', text: 'Graph 2' },
          { id: 'g3', text: 'Graph 3' },
          { id: 'g4', text: 'Graph 4' },
          { id: 'g5', text: 'Graph 5' },
          { id: 'g6', text: 'Graph 6' },
        ],
      },
    },
    zh: {
      title: '环检测挑战 II',
      teaching: `在有向图中检测**环**需要遵循边的方向。路径 A→B→C→A 是一个环；A→B→C 没有回路则不是。\n\n在无向图中，通过不同边重新访问任何节点即构成环。\n\n**策略：** 对每个图，尝试找到环或证明不存在环。`,
      description: `以下 6 个图中，哪些包含**环**？选择所有符合条件的选项。`,
      data: {
        graphs: [
          {
            id: 'g1', label: '图 1',
            nodes: [{ id: 'A', x: 40, y: 40 }, { id: 'B', x: 210, y: 40 }, { id: 'C', x: 125, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }],
            directed: true,
          },
          {
            id: 'g2', label: '图 2',
            nodes: [{ id: 'A', x: 30, y: 80 }, { id: 'B', x: 130, y: 20 }, { id: 'C', x: 230, y: 80 }, { id: 'D', x: 130, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'B' }],
            directed: true,
          },
          {
            id: 'g3', label: '图 3',
            nodes: [{ id: 'A', x: 30, y: 80 }, { id: 'B', x: 130, y: 20 }, { id: 'C', x: 230, y: 80 }, { id: 'D', x: 130, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'D' }, { from: 'C', to: 'D' }],
            directed: true,
          },
          {
            id: 'g4', label: '图 4',
            nodes: [{ id: 'A', x: 40, y: 40 }, { id: 'B', x: 210, y: 40 }, { id: 'C', x: 125, y: 150 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }],
            directed: true,
          },
          {
            id: 'g5', label: '图 5',
            nodes: [{ id: 'A', x: 30, y: 100 }, { id: 'B', x: 110, y: 20 }, { id: 'C', x: 190, y: 100 }, { id: 'D', x: 280, y: 60 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }, { from: 'C', to: 'D' }],
            directed: true,
          },
          {
            id: 'g6', label: '图 6',
            nodes: [{ id: 'A', x: 20, y: 40 }, { id: 'B', x: 90, y: 100 }, { id: 'C', x: 160, y: 40 }, { id: 'D', x: 230, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }],
            directed: true,
          },
        ],
        options: [
          { id: 'g1', text: '图 1' },
          { id: 'g2', text: '图 2' },
          { id: 'g3', text: '图 3' },
          { id: 'g4', text: '图 4' },
          { id: 'g5', text: '图 5' },
          { id: 'g6', text: '图 6' },
        ],
      },
    },
    // g1: A→B→C — DAG, no cycle ✗
    // g2: B→C→D→B — cycle ✓
    // g3: A→B→D, A→C→D — DAG (diamond), no cycle ✗
    // g4: A→B→C→A — cycle ✓
    // g5: A→B→C→A — cycle ✓ (plus C→D, irrelevant)
    // g6: A→B→C→D — DAG, no cycle ✗
    answer: ['g2', 'g4', 'g5'],
  },

  {
    id: 'graph-b-06',
    topic: 'graphs',
    difficulty: 'hard',
    points: 15,
    type: 'click-edges',
    en: {
      title: 'Minimum Spanning Tree Builder II',
      teaching: `**Kruskal's algorithm** for MST:\n1. Sort all edges by weight.\n2. Greedily add the cheapest edge that does **not** create a cycle (using a Union-Find to track components).\n3. Stop when you have exactly n–1 edges (all nodes connected).\n\nFor n=8 nodes you need exactly **7 edges**. Ties in weight are broken arbitrarily — multiple valid MSTs may exist, but the total weight is unique.`,
      description: `Click the **7 edges** that form the Minimum Spanning Tree for this 8-node weighted graph.\n\nEdge weights are shown on each edge.`,
      data: {
        nodes: [
          { id: 'A', x: 80,  y: 200 },
          { id: 'B', x: 200, y: 80  },
          { id: 'C', x: 200, y: 320 },
          { id: 'D', x: 340, y: 80  },
          { id: 'E', x: 340, y: 230 },
          { id: 'F', x: 350, y: 370 },
          { id: 'G', x: 480, y: 130 },
          { id: 'H', x: 480, y: 300 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 4  },
          { id: 'A-C', from: 'A', to: 'C', weight: 3  },
          { id: 'B-C', from: 'B', to: 'C', weight: 2  },
          { id: 'B-D', from: 'B', to: 'D', weight: 8  },
          { id: 'B-E', from: 'B', to: 'E', weight: 5  },
          { id: 'C-F', from: 'C', to: 'F', weight: 7  },
          { id: 'D-E', from: 'D', to: 'E', weight: 3  },
          { id: 'D-G', from: 'D', to: 'G', weight: 9  },
          { id: 'E-F', from: 'E', to: 'F', weight: 4  },
          { id: 'E-G', from: 'E', to: 'G', weight: 2  },
          { id: 'F-H', from: 'F', to: 'H', weight: 6  },
          { id: 'G-H', from: 'G', to: 'H', weight: 5  },
        ],
        directed: false,
        mstCount: 7,
      },
    },
    zh: {
      title: '最小生成树构建器 II',
      teaching: `**Kruskal 算法**求 MST：\n1. 将所有边按权重排序。\n2. 贪心地添加不会产生环的最便宜边（使用并查集追踪连通分量）。\n3. 当有 n–1 条边时停止（所有节点连通）。\n\n对于 n=8 个节点，正好需要 **7 条边**。权重相同时可任意打破平局——可能存在多个有效的最小生成树，但总权重是唯一的。`,
      description: `点击构成这个 8 节点加权图的最小生成树的 **7 条边**。\n\n每条边上显示了边权。`,
      data: {
        nodes: [
          { id: 'A', x: 80,  y: 200 },
          { id: 'B', x: 200, y: 80  },
          { id: 'C', x: 200, y: 320 },
          { id: 'D', x: 340, y: 80  },
          { id: 'E', x: 340, y: 230 },
          { id: 'F', x: 350, y: 370 },
          { id: 'G', x: 480, y: 130 },
          { id: 'H', x: 480, y: 300 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 4  },
          { id: 'A-C', from: 'A', to: 'C', weight: 3  },
          { id: 'B-C', from: 'B', to: 'C', weight: 2  },
          { id: 'B-D', from: 'B', to: 'D', weight: 8  },
          { id: 'B-E', from: 'B', to: 'E', weight: 5  },
          { id: 'C-F', from: 'C', to: 'F', weight: 7  },
          { id: 'D-E', from: 'D', to: 'E', weight: 3  },
          { id: 'D-G', from: 'D', to: 'G', weight: 9  },
          { id: 'E-F', from: 'E', to: 'F', weight: 4  },
          { id: 'E-G', from: 'E', to: 'G', weight: 2  },
          { id: 'F-H', from: 'F', to: 'H', weight: 6  },
          { id: 'G-H', from: 'G', to: 'H', weight: 5  },
        ],
        directed: false,
        mstCount: 7,
      },
    },
    // Kruskal sorted: B-C(2), E-G(2), A-C(3), D-E(3), A-B(4), E-F(4), B-E(5), G-H(5), F-H(6), C-F(7), B-D(8), D-G(9)
    // {A},{B},{C},{D},{E},{F},{G},{H}
    // B-C(2): {A},{B,C},{D},{E},{F},{G},{H}
    // E-G(2): {A},{B,C},{D},{E,G},{F},{H}
    // A-C(3): {A,B,C},{D},{E,G},{F},{H}
    // D-E(3): {A,B,C},{D,E,G},{F},{H}
    // A-B(4): A,B both in {A,B,C} → SKIP
    // E-F(4): {A,B,C},{D,E,F,G},{H}
    // B-E(5): {A,B,C,D,E,F,G},{H}
    // G-H(5): {A,B,C,D,E,F,G,H} ✓ — 7 edges done
    answer: ['B-C', 'E-G', 'A-C', 'D-E', 'E-F', 'B-E', 'G-H'],
  },

  {
    id: 'graph-b-07',
    topic: 'graphs',
    difficulty: 'hard',
    points: 15,
    type: 'drag-order',
    en: {
      title: 'Topological Sort — CS Curriculum',
      teaching: `**Topological Sort** on a DAG produces a linear ordering where every edge A → B means A comes **before** B. Use **Kahn's Algorithm**:\n1. Compute the **in-degree** of every node.\n2. Enqueue all nodes with in-degree **0**.\n3. Dequeue a node, add it to the result, and **decrement** the in-degree of each of its neighbors.\n4. If a neighbor's in-degree reaches **0**, enqueue it.\n5. Repeat until the queue is empty.\n\n**A course with 2 prerequisites cannot be scheduled until BOTH are done.**`,
      description: `Plan a CS curriculum. Each course can only be taken after **all** its prerequisites are completed.\n\n**Prerequisite edges (→ = "must complete before"):**\n- Intro CS → Discrete Math\n- Intro CS → Data Structures\n- Intro CS → Computer Architecture\n- Discrete Math → Algorithms\n- Data Structures → Algorithms\n- Data Structures → Databases\n- Computer Architecture → OS\n- Computer Architecture → Networking\n- Algorithms → Compilers\n- OS → Compilers\n\n**Starting in-degrees:**\nIntro CS: 0 · Discrete Math: 1 · Data Structures: 1 · Computer Architecture: 1 · Algorithms: 2 · Databases: 1 · OS: 1 · Networking: 1 · Compilers: 2\n\n**Drag the 9 courses into a valid enrollment order (left = first, right = last).**`,
      data: {
        nodes: [
          { id: 'Intro CS',              x: 60,  y: 140 },
          { id: 'Discrete Math',         x: 240, y: 50  },
          { id: 'Data Structures',       x: 240, y: 140 },
          { id: 'Computer Architecture', x: 240, y: 230 },
          { id: 'Algorithms',            x: 430, y: 90  },
          { id: 'Databases',             x: 430, y: 180 },
          { id: 'OS',                    x: 430, y: 270 },
          { id: 'Networking',            x: 430, y: 360 },
          { id: 'Compilers',             x: 620, y: 170 },
        ],
        edges: [
          { from: 'Intro CS',              to: 'Discrete Math'         },
          { from: 'Intro CS',              to: 'Data Structures'       },
          { from: 'Intro CS',              to: 'Computer Architecture' },
          { from: 'Discrete Math',         to: 'Algorithms'            },
          { from: 'Data Structures',       to: 'Algorithms'            },
          { from: 'Data Structures',       to: 'Databases'             },
          { from: 'Computer Architecture', to: 'OS'                    },
          { from: 'Computer Architecture', to: 'Networking'            },
          { from: 'Algorithms',            to: 'Compilers'             },
          { from: 'OS',                    to: 'Compilers'             },
        ],
        directed: true,
        pool: [
          'Intro CS', 'Discrete Math', 'Data Structures', 'Computer Architecture',
          'Algorithms', 'Databases', 'OS', 'Networking', 'Compilers',
        ],
        slots: 9,
        layout: 'horizontal',
      },
    },
    zh: {
      title: '拓扑排序 — 计算机课程规划',
      teaching: `对 DAG 进行**拓扑排序**产生线性序列，使得每条边 A → B 意味着 A 在 B **之前**出现。使用 **Kahn 算法**：\n1. 计算每个节点的**入度**。\n2. 将入度为 **0** 的节点入队。\n3. 出队一个节点，加入结果，将其所有邻居的入度**减 1**。\n4. 若某邻居入度变为 **0**，将其入队。\n5. 重复直到队列为空。\n\n**有 2 个先修课程的课，只有在两者都完成后才能选修。**`,
      description: `规划一份计算机课程表。每门课只能在**所有**先修课完成后才能选修。\n\n**先修关系（→ = "必须先完成"）：**\n- 计算机导论 → 离散数学\n- 计算机导论 → 数据结构\n- 计算机导论 → 计算机体系结构\n- 离散数学 → 算法\n- 数据结构 → 算法\n- 数据结构 → 数据库\n- 计算机体系结构 → 操作系统\n- 计算机体系结构 → 计算机网络\n- 算法 → 编译原理\n- 操作系统 → 编译原理\n\n**初始入度：**\n计算机导论: 0 · 离散数学: 1 · 数据结构: 1 · 计算机体系结构: 1 · 算法: 2 · 数据库: 1 · 操作系统: 1 · 计算机网络: 1 · 编译原理: 2\n\n**将 9 门课程拖入有效的选修顺序（左 = 最先，右 = 最后）。**`,
      data: {
        nodes: [
          { id: 'Intro CS',              x: 60,  y: 140 },
          { id: 'Discrete Math',         x: 240, y: 50  },
          { id: 'Data Structures',       x: 240, y: 140 },
          { id: 'Computer Architecture', x: 240, y: 230 },
          { id: 'Algorithms',            x: 430, y: 90  },
          { id: 'Databases',             x: 430, y: 180 },
          { id: 'OS',                    x: 430, y: 270 },
          { id: 'Networking',            x: 430, y: 360 },
          { id: 'Compilers',             x: 620, y: 170 },
        ],
        edges: [
          { from: 'Intro CS',              to: 'Discrete Math'         },
          { from: 'Intro CS',              to: 'Data Structures'       },
          { from: 'Intro CS',              to: 'Computer Architecture' },
          { from: 'Discrete Math',         to: 'Algorithms'            },
          { from: 'Data Structures',       to: 'Algorithms'            },
          { from: 'Data Structures',       to: 'Databases'             },
          { from: 'Computer Architecture', to: 'OS'                    },
          { from: 'Computer Architecture', to: 'Networking'            },
          { from: 'Algorithms',            to: 'Compilers'             },
          { from: 'OS',                    to: 'Compilers'             },
        ],
        directed: true,
        pool: [
          'Intro CS', 'Discrete Math', 'Data Structures', 'Computer Architecture',
          'Algorithms', 'Databases', 'OS', 'Networking', 'Compilers',
        ],
        slots: 9,
        layout: 'horizontal',
      },
    },
    // Any valid topological order; validated dynamically via Kahn's constraint check
    answer: null, // special: validated by checking DAG constraints
  },
];
