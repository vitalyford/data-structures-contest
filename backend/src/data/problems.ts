export type ProblemType =
  | 'drag-order'
  | 'multi-choice'
  | 'checkbox-multi'
  | 'click-sequence'
  | 'click-bug'
  | 'drag-match'
  | 'fill-matrix'
  | 'click-edges'
  | 'drag-priority'
  | 'click-cells';

export interface ProblemContent {
  title: string;
  teaching?: string;   // teaching/explanation section
  description: string;
  data: Record<string, unknown>;
}

export interface Problem {
  id: string;
  topic: 'stacks' | 'queues' | 'graphs';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  type: ProblemType;
  en: ProblemContent;
  zh: ProblemContent;
  answer: unknown;
}

export const problems: Problem[] = [
  // ══════════════════════════════════════════════════
  // STACKS
  // ══════════════════════════════════════════════════
  {
    id: 'stack-01',
    topic: 'stacks',
    difficulty: 'easy',
    points: 5,
    type: 'drag-order',
    en: {
      title: 'Stack Trace Challenge',
      teaching: `A **stack** works like a stack of plates: you can only add (push) or remove (pop) from the **top**. This is called **LIFO — Last In, First Out**.\n\nTip: trace each operation one by one and update your mental picture of the stack. Items that get popped are **gone** — don't place them in the final answer.`,
      description: `An empty stack goes through **9 operations**:\n\n1. push(F)\n2. push(G)\n3. pop()\n4. push(H)\n5. push(J)\n6. pop()\n7. pop()\n8. push(K)\n9. push(L)\n\n**Drag the items into the correct slots to show the final stack state (bottom → top).** The pool contains all letters that were pushed — some are red herrings.`,
      data: {
        pool: ['F', 'G', 'H', 'J', 'K', 'L'],
        slots: 3,
        slotLabels: ['Bottom', 'Middle', 'Top'],
      },
    },
    zh: {
      title: '栈追踪挑战',
      teaching: `**栈**就像一叠盘子：你只能从**顶部**添加（压栈）或移除（弹栈）。这称为**后进先出（LIFO）**。\n\n提示：逐步追踪每个操作，实时更新脑海中的栈状态。被弹出的元素**已消失**——不要将它们放入最终答案。`,
      description: `一个空栈经过 **9 次操作**：\n\n1. push(F)\n2. push(G)\n3. pop()\n4. push(H)\n5. push(J)\n6. pop()\n7. pop()\n8. push(K)\n9. push(L)\n\n**将元素拖入正确的槽位，显示最终栈状态（底部 → 顶部）。** 候选池包含所有被压入过的字母——其中有些是干扰项。`,
      data: {
        pool: ['F', 'G', 'H', 'J', 'K', 'L'],
        slots: 3,
        slotLabels: ['底部', '中间', '顶部'],
      },
    },
    // Trace: [F]→[F,G]→[F]→[F,H]→[F,H,J]→[F,H]→[F]→[F,K]→[F,K,L]
    answer: ['F', 'K', 'L'],
  },

  {
    id: 'stack-02',
    topic: 'stacks',
    difficulty: 'easy',
    points: 5,
    type: 'drag-match',
    en: {
      title: 'Operation → Final State Matcher',
      teaching: `To find what a stack looks like after a sequence of operations, trace through them one by one:\n- **push(x)** adds x on top\n- **pop()** removes the top item (it is gone forever)\n\nAll five sequences below use the **same letters A, B, C** — you cannot match by letter alone. Track every push and pop carefully; a letter you see in the sequence may have been popped away before the end.`,
      description: `Each row on the left is a sequence of stack operations starting from an **empty stack**. Drag it to the matching final stack state on the right.\n\n**All sequences use the same letters A, B, C.** Trace each one step by step — the top of the result stack is the last item that was pushed and never popped.`,
      data: {
        left: [
          'push(A), push(B), push(C), pop()',
          'push(C), push(A), pop(), push(B)',
          'push(B), push(C), pop(), pop(), push(A)',
          'push(B), push(A), push(C), pop(), pop()',
          'push(A), push(C), pop(), push(B), push(C)',
        ],
        right: [
          'Stack: [A, B, C]',
          'Stack: [A]',
          'Stack: [B]',
          'Stack: [C, B]',
          'Stack: [A, B]',
        ],
      },
    },
    zh: {
      title: '操作序列 → 最终状态匹配',
      teaching: `要找出一系列操作后栈的状态，逐步追踪：\n- **push(x)** 将 x 添加到顶部\n- **pop()** 移除顶部元素（永久消失）\n\n下面五个序列使用**相同的字母 A、B、C**——不能仅凭字母匹配！在序列中出现的字母可能已经被弹出，逐步追踪才能找到正确答案。`,
      description: `左侧每行是从**空栈**开始的操作序列。将其拖到右侧对应的最终栈状态。\n\n**所有序列使用相同的字母 A、B、C。** 逐步追踪每个序列——结果栈的顶部是最后一个被压入且未被弹出的元素。`,
      data: {
        left: [
          'push(A), push(B), push(C), pop()',
          'push(C), push(A), pop(), push(B)',
          'push(B), push(C), pop(), pop(), push(A)',
          'push(B), push(A), push(C), pop(), pop()',
          'push(A), push(C), pop(), push(B), push(C)',
        ],
        right: [
          'Stack: [A, B, C]',
          'Stack: [A]',
          'Stack: [B]',
          'Stack: [C, B]',
          'Stack: [A, B]',
        ],
      },
    },
    // Seq1: []→[A]→[A,B]→[A,B,C]→[A,B]                   result: [A, B]
    // Seq2: []→[C]→[C,A]→[C]→[C,B]                        result: [C, B]
    // Seq3: []→[B]→[B,C]→[B]→[]→[A]                       result: [A]
    // Seq4: []→[B]→[B,A]→[B,A,C]→[B,A]→[B]                result: [B]
    // Seq5: []→[A]→[A,C]→[A]→[A,B]→[A,B,C]                result: [A, B, C]
    // Right column shuffled: [A,B,C],[A],[B],[C,B],[A,B] — no left[i] matches right[i]
    answer: {
      'push(A), push(B), push(C), pop()': 'Stack: [A, B]',
      'push(C), push(A), pop(), push(B)': 'Stack: [C, B]',
      'push(B), push(C), pop(), pop(), push(A)': 'Stack: [A]',
      'push(B), push(A), push(C), pop(), pop()': 'Stack: [B]',
      'push(A), push(C), pop(), push(B), push(C)': 'Stack: [A, B, C]',
    },
  },

  {
    id: 'stack-03',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'drag-order',
    en: {
      title: 'Function Call Stack Sorter',
      teaching: `When a program calls a function, the computer needs to **remember where to return** after that function finishes. It uses a **call stack** — like bookmarks stacking up in a book.\n\nWhen \`main()\` calls \`functionA()\`, and \`functionA()\` calls \`functionB()\`:\n- First, \`main\` is pushed → [main]\n- Then \`functionA\` is pushed → [main, functionA]\n- Then \`functionB\` is pushed → [main, functionA, functionB]\n\n**The topmost frame is the function currently running.**`,
      description: `A program runs the following sequence:\n1. \`main()\` starts\n2. \`main()\` calls \`computeAverage()\`\n3. \`computeAverage()\` calls \`sumList()\`\n\n**Drag the function frames into the correct call stack order (bottom = first called, top = currently running).**`,
      data: {
        pool: ['main()', 'computeAverage()', 'sumList()'],
        slots: 3,
        slotLabels: ['Bottom (first called)', 'Middle', 'Top (currently running)'],
      },
    },
    zh: {
      title: '函数调用栈排序',
      teaching: `当程序调用一个函数时，计算机需要**记住函数结束后返回到哪里**。它使用**调用栈**——就像在书中叠放书签一样。\n\n当 \`main()\` 调用 \`functionA()\`，而 \`functionA()\` 又调用 \`functionB()\` 时：\n- 首先，\`main\` 被压入 → [main]\n- 然后，\`functionA\` 被压入 → [main, functionA]\n- 然后，\`functionB\` 被压入 → [main, functionA, functionB]\n\n**最顶层的帧是当前正在运行的函数。**`,
      description: `程序按以下顺序执行：\n1. \`main()\` 开始\n2. \`main()\` 调用 \`computeAverage()\`\n3. \`computeAverage()\` 调用 \`sumList()\`\n\n**将函数帧拖入正确的调用栈顺序（底部 = 最先调用，顶部 = 当前运行）。**`,
      data: {
        pool: ['main()', 'computeAverage()', 'sumList()'],
        slots: 3,
        slotLabels: ['底部（最先调用）', '中间', '顶部（当前运行）'],
      },
    },
    answer: ['main()', 'computeAverage()', 'sumList()'],
  },

  {
    id: 'stack-04',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'multi-choice',
    en: {
      title: 'Stack Snapshot Quiz',
      teaching: `Trace through stack operations step by step. Remember:\n- **push(x)** → adds x on top\n- **pop()** → removes and returns the top item\n\nThe stack grows upward — the last item pushed is always on top.\n\n**Worked example:** Starting with an empty stack:\n\n| Step | Operation | Stack after (bottom → top) |\n|------|-----------|----------------------------|\n| 1 | push(5) | [5] |\n| 2 | push(2) | [5, 2] |\n| 3 | pop() | [5] |\n| 4 | push(8) | [5, 8] |\n\nResult: bottom is 5, top is 8 — two items.`,
      description: `Now trace this new sequence yourself. Starting with an empty stack:\n\n| Step | Operation |\n|------|-----------|\n| 1 | push(4) |\n| 2 | push(6) |\n| 3 | push(2) |\n| 4 | pop() |\n| 5 | pop() |\n| 6 | push(9) |\n| 7 | pop() |\n| 8 | push(1) |\n\n**What does the stack look like after all 8 operations?**`,
      data: {
        options: [
          { id: 'A', text: 'Only 4 — one item' },
          { id: 'B', text: 'Bottom: 4, Top: 1 — two items' },
          { id: 'C', text: 'Bottom: 4, Top: 9 — two items' },
          { id: 'D', text: 'Bottom: 4, Top: 6 — two items' },
        ],
      },
    },
    zh: {
      title: '栈快照测验',
      teaching: `逐步追踪栈操作。记住：\n- **push(x)** → 将 x 添加到顶部\n- **pop()** → 移除并返回顶部元素\n\n栈向上增长——最后压入的元素始终在顶部。\n\n**示例演示：** 从空栈开始：\n\n| 步骤 | 操作 | 操作后的栈（底部 → 顶部）|\n|------|-----------|----------------------------|\n| 1 | push(5) | [5] |\n| 2 | push(2) | [5, 2] |\n| 3 | pop() | [5] |\n| 4 | push(8) | [5, 8] |\n\n结果：底部是 5，顶部是 8——共两个元素。`,
      description: `现在自己追踪这个新序列。从空栈开始：\n\n| 步骤 | 操作 |\n|------|------|\n| 1 | push(4) |\n| 2 | push(6) |\n| 3 | push(2) |\n| 4 | pop() |\n| 5 | pop() |\n| 6 | push(9) |\n| 7 | pop() |\n| 8 | push(1) |\n\n**执行全部 8 步操作后，栈的状态是什么？**`,
      data: {
        options: [
          { id: 'A', text: '只有 4 — 一个元素' },
          { id: 'B', text: '底部：4，顶部：1 — 两个元素' },
          { id: 'C', text: '底部：4，顶部：9 — 两个元素' },
          { id: 'D', text: '底部：4，顶部：6 — 两个元素' },
        ],
      },
    },
    answer: 'B',
  },

  {
    id: 'stack-05',
    topic: 'stacks',
    difficulty: 'medium',
    points: 10,
    type: 'multi-choice',
    en: {
      title: 'Undo/Redo Scenario',
      teaching: `Most applications use a **stack to implement Undo**. Each action is pushed onto the undo stack. When you undo, the top action is popped and reversed. **Redo** uses a second stack — but it is cleared whenever you perform a new action.`,
      description: `A student is typing in a text editor. Starting from the text **"Hello"**, the following actions occur:\n\n1. Type " World" → text becomes "Hello World"\n2. Type "!" → text becomes "Hello World!"\n3. Press Undo → reverts last action\n4. Press Undo → reverts again\n5. Type " Math" → new action; **redo stack is cleared**\n6. Press Redo → (does nothing — redo stack is empty)\n\n**What is the final text?**`,
      data: {
        options: [
          { id: 'A', text: '"Hello World"' },
          { id: 'B', text: '"Hello Math"' },
          { id: 'C', text: '"Hello World!"' },
          { id: 'D', text: '"Hello"' },
        ],
      },
    },
    zh: {
      title: '撤销/重做场景',
      teaching: `大多数应用程序使用**栈来实现撤销功能**。每个操作被压入撤销栈。撤销时，顶部操作被弹出并还原。**重做**使用第二个栈——但每当执行新操作时，该栈会被清空。`,
      description: `一名学生正在文本编辑器中输入。从文本 **"Hello"** 开始，依次发生以下操作：\n\n1. 输入 " World" → 文本变为 "Hello World"\n2. 输入 "!" → 文本变为 "Hello World!"\n3. 按撤销 → 还原最后一步操作\n4. 再次按撤销 → 再次还原\n5. 输入 " Math" → 新操作；**重做栈被清空**\n6. 按重做 → （无效——重做栈为空）\n\n**最终文本是什么？**`,
      data: {
        options: [
          { id: 'A', text: '"Hello World"' },
          { id: 'B', text: '"Hello Math"' },
          { id: 'C', text: '"Hello World!"' },
          { id: 'D', text: '"Hello"' },
        ],
      },
    },
    answer: 'B',
  },

  {
    id: 'stack-06',
    topic: 'stacks',
    difficulty: 'hard',
    points: 15,
    type: 'checkbox-multi',
    en: {
      title: 'Pop Sequence Validator',
      teaching: `Items 1, 2, 3, 4, 5 are pushed **one at a time in order**. Between any two pushes, you may pop as many items as you want. The key rule: **you can never pop an item that hasn't been pushed yet**, and **the stack is LIFO** — you must always pop the most-recently-pushed item first.`,
      description: `Items are pushed onto a stack in order: **1, 2, 3, 4, 5** (one at a time).\n\nWhich of the following pop sequences are **possible**? Check all that apply.`,
      data: {
        options: [
          { id: 'A', text: '[5, 4, 3, 2, 1]' },
          { id: 'B', text: '[1, 2, 3, 4, 5]' },
          { id: 'C', text: '[3, 5, 4, 2, 1]' },
          { id: 'D', text: '[3, 4, 5, 1, 2]' },
          { id: 'E', text: '[4, 5, 3, 2, 1]' },
          { id: 'F', text: '[2, 4, 5, 3, 1]' },
        ],
      },
    },
    zh: {
      title: '弹出序列验证器',
      teaching: `元素 1、2、3、4、5 **按顺序逐一压栈**。在任意两次压栈之间，你可以弹出任意数量的元素。关键规则：**不能弹出尚未压入的元素**，且**栈遵循后进先出**——必须先弹出最近压入的元素。`,
      description: `元素按顺序压栈：**1, 2, 3, 4, 5**（逐一压入）。\n\n以下哪些弹出序列是**可能的**？选择所有符合条件的选项。`,
      data: {
        options: [
          { id: 'A', text: '[5, 4, 3, 2, 1]' },
          { id: 'B', text: '[1, 2, 3, 4, 5]' },
          { id: 'C', text: '[3, 5, 4, 2, 1]' },
          { id: 'D', text: '[3, 4, 5, 1, 2]' },
          { id: 'E', text: '[4, 5, 3, 2, 1]' },
          { id: 'F', text: '[2, 4, 5, 3, 1]' },
        ],
      },
    },
    // Valid: A✓, B✓, C✓, E✓, F✓  Invalid: D✗
    answer: ['A', 'B', 'C', 'E', 'F'],
  },

  {
    id: 'stack-07',
    topic: 'stacks',
    difficulty: 'hard',
    points: 15,
    type: 'click-bug',
    en: {
      title: 'Bug Hunt: Stack Logic',
      teaching: `This function checks if a string of brackets is **balanced** — meaning every opening bracket has a matching closing bracket in the correct order.\n\nThe algorithm: push every opening bracket; when a closing bracket is seen, pop the stack and verify the pair matches. The helper \`isPair(open, close)\` returns **true** when the two characters are a valid bracket pair (e.g., \`(\` and \`)\`).`,
      description: `The function below has **exactly one bug**. Click the line number that contains the bug.\n\n\`\`\`java\n1:  public boolean isBalanced(String s) {\n2:      Stack<Character> stack = new Stack<>();\n3:      for (char c : s.toCharArray()) {\n4:          if (c == '(' || c == '[' || c == '{') {\n5:              stack.push(c);\n6:          } else {\n7:              if (stack.isEmpty()) return false;\n8:              char top = stack.pop();\n9:              if (isPair(top, c)) return false;\n10:         }\n11:     }\n12:     return stack.isEmpty();\n13: }\n\`\`\``,
      data: {
        lines: 13,
        bugLine: 9,
      },
    },
    zh: {
      title: '漏洞猎手：栈逻辑',
      teaching: `该函数检查括号字符串是否**平衡**——即每个左括号都有一个对应的正确右括号与之匹配。\n\n算法：将每个左括号压栈；遇到右括号时，弹出栈顶并验证是否匹配。辅助方法 \`isPair(open, close)\` 在两个字符是有效括号对时返回 **true**（例如 \`(\` 和 \`)\`）。`,
      description: `下面的函数中**恰好有一个漏洞**。点击包含漏洞的行号。\n\n\`\`\`java\n1:  public boolean isBalanced(String s) {\n2:      Stack<Character> stack = new Stack<>();\n3:      for (char c : s.toCharArray()) {\n4:          if (c == '(' || c == '[' || c == '{') {\n5:              stack.push(c);\n6:          } else {\n7:              if (stack.isEmpty()) return false;\n8:              char top = stack.pop();\n9:              if (isPair(top, c)) return false;\n10:         }\n11:     }\n12:     return stack.isEmpty();\n13: }\n\`\`\``,
      data: {
        lines: 13,
        bugLine: 9,
      },
    },
    // Line 9: isPair returns true when brackets DO match — condition is inverted; should be if (!isPair(top, c))
    answer: 9,
  },

  // ══════════════════════════════════════════════════
  // QUEUES
  // ══════════════════════════════════════════════════
  {
    id: 'queue-01',
    topic: 'queues',
    difficulty: 'easy',
    points: 5,
    type: 'drag-order',
    en: {
      title: 'Ticket Queue Simulator',
      teaching: `A **queue** works like a line at a ticket counter: new people join at the **back**, and the person at the **front** is served first. This is called **FIFO — First In, First Out**.\n\n- **Enqueue** = join the back of the line\n- **Dequeue** = the front person leaves (is served)`,
      description: `Starting from an empty queue, these operations happen:\n\n1. enqueue("Alice")\n2. enqueue("Bob")\n3. enqueue("Charlie")\n4. dequeue()\n5. enqueue("Diana")\n6. dequeue()\n\n**Drag the remaining customers into the correct queue order (front → back).**`,
      data: {
        pool: ['Alice', 'Bob', 'Charlie', 'Diana'],
        slots: 2,
        slotLabels: ['Front (served next)', 'Back'],
      },
    },
    zh: {
      title: '票务队列模拟器',
      teaching: `**队列**就像售票窗口前的排队：新来的人加入**末尾**，**最前面**的人先得到服务。这称为**先进先出（FIFO）**。\n\n- **入队（Enqueue）** = 加入队列末尾\n- **出队（Dequeue）** = 队首的人离开（被服务）`,
      description: `从一个空队列开始，依次发生以下操作：\n\n1. enqueue("Alice")\n2. enqueue("Bob")\n3. enqueue("Charlie")\n4. dequeue() — Alice 被服务并离开\n5. enqueue("Diana")\n6. dequeue() — 下一个人被服务并离开\n\n**将剩余的顾客拖入正确的队列顺序（队首 → 队尾）。**`,
      data: {
        pool: ['Alice', 'Bob', 'Charlie', 'Diana'],
        slots: 2,
        slotLabels: ['队首（下一个被服务）', '队尾'],
      },
    },
    answer: ['Charlie', 'Diana'],
  },

  {
    id: 'queue-02',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'click-sequence',
    en: {
      title: 'BFS Click Traversal',
      teaching: `**Breadth-First Search (BFS)** explores a graph **layer by layer** — imagine dropping paint on a starting node; it spreads to all immediate neighbors first, then their neighbors, and so on.\n\nBFS uses a **queue**: start by enqueuing the source node, then repeatedly dequeue a node, visit it, and enqueue its unvisited neighbors.`,
      description: `Perform **BFS starting from node A** on the graph below.\n\nClick the nodes **in the order BFS would visit them**. Use the adjacency list:\n- A → [B, C]\n- B → [D, E]\n- C → [F, G]\n- D, E, F, G → no further unvisited neighbors`,
      data: {
        nodes: [
          { id: 'A', x: 220, y: 50  },
          { id: 'B', x: 110, y: 160 },
          { id: 'C', x: 330, y: 160 },
          { id: 'D', x: 40,  y: 290 },
          { id: 'E', x: 170, y: 290 },
          { id: 'F', x: 270, y: 290 },
          { id: 'G', x: 390, y: 290 },
        ],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
          { from: 'C', to: 'F' }, { from: 'C', to: 'G' },
        ],
        directed: false,
      },
    },
    zh: {
      title: 'BFS 点击遍历',
      teaching: `**广度优先搜索（BFS）** 按**层次**探索图——想象在起始节点上滴落颜料；它首先向所有直接相邻节点扩散，然后是它们的相邻节点，依此类推。\n\nBFS 使用**队列**：将源节点入队，然后反复出队一个节点，访问它，并将其未访问的邻居入队。`,
      description: `在下图中，从**节点 A 开始执行 BFS**。\n\n按照 BFS 访问节点的顺序**依次点击节点**。邻接表如下：\n- A → [B, C]\n- B → [D, E]\n- C → [F, G]\n- D, E, F, G → 无更多未访问邻居`,
      data: {
        nodes: [
          { id: 'A', x: 220, y: 50  },
          { id: 'B', x: 110, y: 160 },
          { id: 'C', x: 330, y: 160 },
          { id: 'D', x: 40,  y: 290 },
          { id: 'E', x: 170, y: 290 },
          { id: 'F', x: 270, y: 290 },
          { id: 'G', x: 390, y: 290 },
        ],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
          { from: 'C', to: 'F' }, { from: 'C', to: 'G' },
        ],
        directed: false,
      },
    },
    answer: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },

  {
    id: 'queue-03',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'drag-priority',
    en: {
      title: 'Priority Queue Reorder',
      teaching: `A **priority queue** is like a hospital emergency room: patients are not served in arrival order — the most critical patients go first, regardless of when they arrived.\n\nEach item has a **priority number** (higher = more urgent). The item with the highest priority is always dequeued first.`,
      description: `Five patients arrive at an ER. **Drag them into the correct treatment order (most urgent first).**\n\n| Patient | Condition | Urgency |\n|---------|-----------|--------|\n| Alex | Chest pain | 5 (Critical) |\n| Sam | Small cut | 1 (Minor) |\n| Jordan | Broken arm | 4 (High) |\n| Casey | Headache | 2 (Moderate) |\n| Riley | Sprained ankle | 3 (Elevated) |`,
      data: {
        patients: [
          { name: 'Alex', condition: 'Chest pain', urgency: 5 },
          { name: 'Sam', condition: 'Small cut', urgency: 1 },
          { name: 'Jordan', condition: 'Broken arm', urgency: 4 },
          { name: 'Casey', condition: 'Headache', urgency: 2 },
          { name: 'Riley', condition: 'Sprained ankle', urgency: 3 },
        ],
      },
    },
    zh: {
      title: '优先队列重排',
      teaching: `**优先队列**就像医院急诊室：患者不按到达顺序就诊——最危急的患者优先，无论他们何时到达。\n\n每个元素都有一个**优先级数字**（越高越紧急）。优先级最高的元素总是最先出队。`,
      description: `五名患者来到急诊室。**将他们拖到正确的就诊顺序（最紧急的优先）。**\n\n| 患者 | 症状 | 紧急程度 |\n|---------|-----------|--------|\n| Alex | 胸痛 | 5（危急） |\n| Sam | 小伤口 | 1（轻微） |\n| Jordan | 手臂骨折 | 4（高） |\n| Casey | 头痛 | 2（中等） |\n| Riley | 脚踝扭伤 | 3（升高） |`,
      data: {
        patients: [
          { name: 'Alex', condition: '胸痛', urgency: 5 },
          { name: 'Sam', condition: '小伤口', urgency: 1 },
          { name: 'Jordan', condition: '手臂骨折', urgency: 4 },
          { name: 'Casey', condition: '头痛', urgency: 2 },
          { name: 'Riley', condition: '脚踝扭伤', urgency: 3 },
        ],
      },
    },
    answer: ['Alex', 'Jordan', 'Riley', 'Casey', 'Sam'],
  },

  {
    id: 'queue-04',
    topic: 'queues',
    difficulty: 'medium',
    points: 10,
    type: 'drag-match',
    en: {
      title: 'Queue Operations State Match',
      teaching: `A queue supports three main operations:\n- **enqueue(x)** — adds x to the **back** of the queue\n- **dequeue()** — removes and returns the item at the **front**\n- **peek()** — returns the front item **without removing it**\n\nThe queue changes after enqueue and dequeue, but **not after peek**.`,
      description: `Starting queue (front → back): **[10, 20, 30]**\n\nMatch each operation on the left to the resulting queue state on the right.\n\nDrag each result box to the correct operation.`,
      data: {
        left: [
          { id: 'op1', text: 'enqueue(40)' },
          { id: 'op2', text: 'dequeue()' },
          { id: 'op3', text: 'peek()' },
          { id: 'op4', text: 'dequeue(), then enqueue(5)' },
        ],
        right: [
          { id: 'sA', text: '[10, 20, 30] — unchanged' },
          { id: 'sB', text: '[10, 20, 30, 40]' },
          { id: 'sC', text: '[20, 30]' },
          { id: 'sD', text: '[20, 30, 5]' },
        ],
      },
    },
    zh: {
      title: '队列操作状态匹配',
      teaching: `队列支持三种主要操作：\n- **enqueue(x)** — 将 x 添加到队列的**末尾**\n- **dequeue()** — 移除并返回**队首**元素\n- **peek()** — 返回队首元素**但不移除它**\n\n入队和出队后队列会改变，但**peek 后不会改变**。`,
      description: `初始队列（队首 → 队尾）：**[10, 20, 30]**\n\n将左侧的每个操作与右侧对应的队列状态匹配。\n\n将每个结果框拖到对应的操作上。`,
      data: {
        left: [
          { id: 'op1', text: 'enqueue(40)' },
          { id: 'op2', text: 'dequeue()' },
          { id: 'op3', text: 'peek()' },
          { id: 'op4', text: 'dequeue()，然后 enqueue(5)' },
        ],
        right: [
          { id: 'sA', text: '[10, 20, 30] — 未改变' },
          { id: 'sB', text: '[10, 20, 30, 40]' },
          { id: 'sC', text: '[20, 30]' },
          { id: 'sD', text: '[20, 30, 5]' },
        ],
      },
    },
    answer: { op1: 'sB', op2: 'sC', op3: 'sA', op4: 'sD' },
  },

  {
    id: 'queue-05',
    topic: 'queues',
    difficulty: 'hard',
    points: 15,
    type: 'click-cells',
    en: {
      title: 'Circular Queue Index Puzzle',
      teaching: `A **circular queue** uses a fixed-size array. The **rear** pointer advances using modulo: \`rear = (rear + 1) % capacity\`.\n\nThink of a **clock face** — after position 3, the next position is 0 (not 4).\n\nTwo pointers to track:\n- **front** — the oldest element (next to dequeue)\n- **rear** — the **next empty slot** (where the next enqueue goes)\n\n**Worked example — capacity 4 (indices 0–3), starting empty:**\n\n| Step | Operation | Array [0–3] | front | rear |\n|------|-----------|-------------|-------|------|\n| 1 | enqueue("A") | A _ _ _ | 0 | 1 |\n| 2 | enqueue("B") | A B _ _ | 0 | 2 |\n| 3 | dequeue() | _ B _ _ | 1 | 2 |\n| 4 | enqueue("C") | _ B C _ | 1 | 3 |\n| 5 | enqueue("D") | _ B C D | 1 | **0** ← wraps! |\n\nAfter step 5: **front=1, rear=0** → occupied indices are **1, 2, 3**. Index 0 is empty — rear always points to the *next empty slot*, not to a stored value.`,
      description: `A circular queue has capacity **5** (indices 0–4). Starting empty with front=0, rear=0, apply these operations one by one:\n\n1. enqueue("P")\n2. enqueue("Q")\n3. enqueue("R")\n4. dequeue()\n5. dequeue()\n6. enqueue("S")\n7. enqueue("T")\n8. dequeue()\n9. enqueue("U")\n\nTrace the front and rear pointers through all 9 operations. Remember: \`rear = (rear + 1) % 5\` on each enqueue, \`front = (front + 1) % 5\` on each dequeue.\n\n**Click the cell indices (0–4) that are occupied after all 9 operations.**`,
      data: {
        capacity: 5,
        cells: ['?', '?', '?', '?', '?'],
        front: 3,
        rear: 1,
      },
    },
    zh: {
      title: '循环队列索引谜题',
      teaching: `**循环队列**使用固定大小的数组。**尾指针**通过取模操作前进：\`rear = (rear + 1) % capacity\`。\n\n想象一个**时钟表盘**——在位置 3 之后，下一个位置是 0（而不是 4）。\n\n需要追踪两个指针：\n- **front（头指针）** — 最旧的元素（下一个出队的元素）\n- **rear（尾指针）** — **下一个空槽位**（下次入队的位置）\n\n**示例——容量 4（索引 0–3），从空队列开始：**\n\n| 步骤 | 操作 | 数组 [0–3] | front | rear |\n|------|-----------|-------------|-------|------|\n| 1 | enqueue("A") | A _ _ _ | 0 | 1 |\n| 2 | enqueue("B") | A B _ _ | 0 | 2 |\n| 3 | dequeue() | _ B _ _ | 1 | 2 |\n| 4 | enqueue("C") | _ B C _ | 1 | 3 |\n| 5 | enqueue("D") | _ B C D | 1 | **0** ← 循环！ |\n\n第 5 步后：**front=1, rear=0** → 已占用的索引为 **1, 2, 3**。索引 0 是空的——rear 始终指向*下一个空槽位*，而非已存储的值。`,
      description: `循环队列容量为 **5**（索引 0–4）。从空队列开始，front=0，rear=0，依次执行以下操作：\n\n1. enqueue("P")\n2. enqueue("Q")\n3. enqueue("R")\n4. dequeue()\n5. dequeue()\n6. enqueue("S")\n7. enqueue("T")\n8. dequeue()\n9. enqueue("U")\n\n逐步追踪 front 和 rear 指针经过全部 9 次操作的变化。记住：每次入队 \`rear = (rear + 1) % 5\`，每次出队 \`front = (front + 1) % 5\`。\n\n**点击所有 9 次操作后已被占用的单元格索引（0–4）。**`,
      data: {
        capacity: 5,
        cells: ['?', '?', '?', '?', '?'],
        front: 3,
        rear: 1,
      },
    },
    // Trace: enqueue P→[P,_,_,_,_] f=0 r=1 | enqueue Q→[P,Q,_,_,_] f=0 r=2 | enqueue R→[P,Q,R,_,_] f=0 r=3
    // dequeue→[_,Q,R,_,_] f=1 r=3 | dequeue→[_,_,R,_,_] f=2 r=3
    // enqueue S→[_,_,R,S,_] f=2 r=4 | enqueue T→[_,_,R,S,T] f=2 r=0(wrap) | dequeue→[_,_,_,S,T] f=3 r=0
    // enqueue U→[U,_,_,S,T] f=3 r=1
    // Occupied indices: 0 (U), 3 (S), 4 (T)
    answer: [0, 3, 4],
  },

  {
    id: 'queue-06',
    topic: 'queues',
    difficulty: 'hard',
    points: 15,
    type: 'click-bug',
    en: {
      title: 'Bug Hunt: Queue Implementation',
      teaching: `In a circular queue, when you **dequeue**, you must:\n1. Save the item at \`arr[front]\`\n2. Advance \`front\` by one (with wrap-around)\n3. Decrease \`size\`\n4. **Return the saved item** — NOT what's now at front!\n\nA common mistake is returning \`arr[front]\` *after* advancing the pointer — which gives the wrong element.`,
      description: `The function below has **exactly one bug**. Click the line number that contains it.\n\n\`\`\`java\n1:  public Object dequeue() {\n2:      if (size == 0) {\n3:          System.out.println("Queue is empty");\n4:          return null;\n5:      }\n6:      Object item = arr[front];\n7:      front = (front + 1) % capacity;\n8:      size--;\n9:      return arr[front];\n10: }\n\`\`\``,
      data: {
        lines: 10,
        bugLine: 9,
      },
    },
    zh: {
      title: '漏洞猎手：队列实现',
      teaching: `在循环队列中，**出队**时必须：\n1. 保存 \`arr[front]\` 处的元素\n2. 将 \`front\` 向前移动一位（带环绕）\n3. 减少 \`size\`\n4. **返回已保存的元素** — 而不是 front 现在指向的元素！\n\n常见错误是在推进指针*之后*返回 \`arr[front]\`——这会返回错误的元素。`,
      description: `下面的函数中**恰好有一个漏洞**。点击包含漏洞的行号。\n\n\`\`\`java\n1:  public Object dequeue() {\n2:      if (size == 0) {\n3:          System.out.println("Queue is empty");\n4:          return null;\n5:      }\n6:      Object item = arr[front];\n7:      front = (front + 1) % capacity;\n8:      size--;\n9:      return arr[front];\n10: }\n\`\`\``,
      data: {
        lines: 10,
        bugLine: 9,
      },
    },
    // Line 9: returns arr[front] after front has been advanced — should return the saved 'item' variable
    answer: 9,
  },

  // ══════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════
  {
    id: 'graph-01',
    topic: 'graphs',
    difficulty: 'easy',
    points: 5,
    type: 'checkbox-multi',
    en: {
      title: 'Graph Property Classifier',
      teaching: `A **graph** is a set of **nodes** (circles) connected by **edges** (lines).\n\n- **Directed**: edges have arrows (one-way streets)\n- **Undirected**: edges have no arrows (two-way streets)\n- **Cyclic**: there is a path that starts and ends at the same node\n- **Acyclic**: no such circular path exists\n- **Connected**: you can reach every node from any other node\n- **Disconnected**: at least one node is isolated`,
      description: `Study the graph below, then check **all properties that apply**.\n\nGraph: Nodes A, B, C, D, E with edges: A→B, B→C, C→A, D→E *(arrows shown)*`,
      data: {
        nodes: [
          { id: 'A', x: 100, y: 80 },
          { id: 'B', x: 250, y: 80 },
          { id: 'C', x: 175, y: 200 },
          { id: 'D', x: 370, y: 80 },
          { id: 'E', x: 370, y: 200 },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'A' },
          { from: 'D', to: 'E' },
        ],
        directed: true,
        options: [
          { id: 'directed', text: 'Directed' },
          { id: 'undirected', text: 'Undirected' },
          { id: 'cyclic', text: 'Contains a cycle' },
          { id: 'acyclic', text: 'Acyclic (no cycle)' },
          { id: 'connected', text: 'Connected' },
          { id: 'disconnected', text: 'Disconnected' },
        ],
      },
    },
    zh: {
      title: '图属性分类器',
      teaching: `**图**是一组**节点**（圆圈）通过**边**（线）连接而成。\n\n- **有向图**：边带箭头（单行道）\n- **无向图**：边无箭头（双向道路）\n- **有环图**：存在从某节点出发并回到该节点的路径\n- **无环图**：不存在此类循环路径\n- **连通图**：从任意节点可以到达所有其他节点\n- **非连通图**：至少有一个节点是孤立的`,
      description: `研究下图，然后勾选**所有适用的属性**。\n\n图：节点 A, B, C, D, E，边：A→B, B→C, C→A, D→E *(箭头已标注)*`,
      data: {
        nodes: [
          { id: 'A', x: 100, y: 80 },
          { id: 'B', x: 250, y: 80 },
          { id: 'C', x: 175, y: 200 },
          { id: 'D', x: 370, y: 80 },
          { id: 'E', x: 370, y: 200 },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'A' },
          { from: 'D', to: 'E' },
        ],
        directed: true,
        options: [
          { id: 'directed', text: '有向图' },
          { id: 'undirected', text: '无向图' },
          { id: 'cyclic', text: '包含环' },
          { id: 'acyclic', text: '无环图' },
          { id: 'connected', text: '连通图' },
          { id: 'disconnected', text: '非连通图' },
        ],
      },
    },
    answer: ['directed', 'cyclic', 'disconnected'],
  },

  {
    id: 'graph-02',
    topic: 'graphs',
    difficulty: 'easy',
    points: 5,
    type: 'fill-matrix',
    en: {
      title: 'Adjacency Matrix Builder',
      teaching: `An **adjacency matrix** is a grid where rows and columns represent nodes. Cell [i][j] = **1** if there is an edge from node i to node j, and **0** if there is no edge.\n\n**Example:** For a graph with edge A–B only:\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 1 | 0 |\n\n*(Undirected edges are symmetric: if [A][B]=1 then [B][A]=1)*`,
      description: `Build the adjacency matrix for this **undirected** graph.\n\nEdges: **A–B, A–C, B–D, C–D**\n\nClick a cell to toggle it between 0 and 1.`,
      data: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'C', to: 'D' },
        ],
        directed: false,
        graphLayout: [
          { id: 'A', x: 150, y: 50 },
          { id: 'B', x: 60, y: 180 },
          { id: 'C', x: 240, y: 180 },
          { id: 'D', x: 150, y: 310 },
        ],
      },
    },
    zh: {
      title: '邻接矩阵构建器',
      teaching: `**邻接矩阵**是一个网格，行和列代表节点。单元格 [i][j] = **1** 表示从节点 i 到节点 j 有边，**0** 表示没有边。\n\n**示例：** 对于只有边 A–B 的图：\n\n| | A | B |\n|---|---|---|\n| A | 0 | 1 |\n| B | 1 | 0 |\n\n*（无向边是对称的：若 [A][B]=1，则 [B][A]=1）*`,
      description: `为这个**无向**图构建邻接矩阵。\n\n边：**A–B, A–C, B–D, C–D**\n\n点击单元格在 0 和 1 之间切换。`,
      data: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
          { from: 'B', to: 'D' }, { from: 'C', to: 'D' },
        ],
        directed: false,
        graphLayout: [
          { id: 'A', x: 150, y: 50 },
          { id: 'B', x: 60, y: 180 },
          { id: 'C', x: 240, y: 180 },
          { id: 'D', x: 150, y: 310 },
        ],
      },
    },
    // Correct cells (row, col) that should be 1 — using node indices 0=A,1=B,2=C,3=D
    answer: [[0,1],[0,2],[1,0],[1,3],[2,0],[2,3],[3,1],[3,2]],
  },

  {
    id: 'graph-03',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'click-sequence',
    en: {
      title: 'DFS Click Traversal',
      teaching: `**Depth-First Search (DFS)** explores a graph by going as **deep as possible** before backtracking.\n\nThink of it like exploring a maze: always take the first available path until you hit a dead end, then backtrack and try the next option.\n\nDFS uses a **stack** (or recursion) to remember where to backtrack.`,
      description: `Perform **DFS starting from node 1** on the graph below.\n\nUse this adjacency list order (visit smaller numbers first):\n- 1 → [2, 3]\n- 2 → [4, 5]\n- 3 → [6]\n- 4 → [7]\n- 5 → [8]\n\nClick nodes **in the order DFS visits them**.`,
      data: {
        nodes: [
          { id: '1', x: 220, y: 30  },
          { id: '2', x: 110, y: 120 },
          { id: '3', x: 330, y: 120 },
          { id: '4', x: 40,  y: 220 },
          { id: '5', x: 170, y: 220 },
          { id: '6', x: 330, y: 220 },
          { id: '7', x: 40,  y: 310 },
          { id: '8', x: 170, y: 310 },
        ],
        edges: [
          { from: '1', to: '2' }, { from: '1', to: '3' },
          { from: '2', to: '4' }, { from: '2', to: '5' },
          { from: '3', to: '6' },
          { from: '4', to: '7' },
          { from: '5', to: '8' },
        ],
        directed: false,
      },
    },
    zh: {
      title: 'DFS 点击遍历',
      teaching: `**深度优先搜索（DFS）** 通过尽可能**深入**探索图，然后再回溯。\n\n就像走迷宫：总是沿着第一条可用路径前进，直到碰壁，然后回溯并尝试下一条路径。\n\nDFS 使用**栈**（或递归）来记录回溯位置。`,
      description: `在下图中，从**节点 1 开始执行 DFS**。\n\n使用此邻接表顺序（优先访问较小编号）：\n- 1 → [2, 3]\n- 2 → [4, 5]\n- 3 → [6]\n- 4 → [7]\n- 5 → [8]\n\n按 DFS 访问节点的顺序**依次点击节点**。`,
      data: {
        nodes: [
          { id: '1', x: 220, y: 30  },
          { id: '2', x: 110, y: 120 },
          { id: '3', x: 330, y: 120 },
          { id: '4', x: 40,  y: 220 },
          { id: '5', x: 170, y: 220 },
          { id: '6', x: 330, y: 220 },
          { id: '7', x: 40,  y: 310 },
          { id: '8', x: 170, y: 310 },
        ],
        edges: [
          { from: '1', to: '2' }, { from: '1', to: '3' },
          { from: '2', to: '4' }, { from: '2', to: '5' },
          { from: '3', to: '6' },
          { from: '4', to: '7' },
          { from: '5', to: '8' },
        ],
        directed: false,
      },
    },
    // DFS: 1→2→4→7(backtrack)→5→8(backtrack)→3→6
    answer: ['1', '2', '4', '7', '5', '8', '3', '6'],
  },

  {
    id: 'graph-04',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'click-edges',
    en: {
      title: 'Shortest Path Highlighter',
      teaching: `In a **weighted graph**, each edge has a cost. The **shortest path** is the one with the **lowest total cost** — not necessarily the fewest hops.\n\n**Dijkstra's algorithm** finds it: start from the source, always expand the cheapest unvisited node, and record the minimum cost to reach each node.\n\n⚠️ Trap: a path with fewer edges may cost *more* than a longer path with cheaper edges.`,
      description: `Click on the **edges that form the shortest (minimum-weight) path from A to F** in the graph below.\n\nEdge weights are shown on each edge. The source is **A**, the target is **F**.\n\nEdges: A-B(1), A-C(4), B-C(2), B-D(6), C-D(3), C-E(5), D-F(1), E-F(2)`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 160 },
          { id: 'B', x: 190, y: 60  },
          { id: 'C', x: 190, y: 260 },
          { id: 'D', x: 330, y: 160 },
          { id: 'E', x: 330, y: 310 },
          { id: 'F', x: 450, y: 160 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 1 },
          { id: 'A-C', from: 'A', to: 'C', weight: 4 },
          { id: 'B-C', from: 'B', to: 'C', weight: 2 },
          { id: 'B-D', from: 'B', to: 'D', weight: 6 },
          { id: 'C-D', from: 'C', to: 'D', weight: 3 },
          { id: 'C-E', from: 'C', to: 'E', weight: 5 },
          { id: 'D-F', from: 'D', to: 'F', weight: 1 },
          { id: 'E-F', from: 'E', to: 'F', weight: 2 },
        ],
        directed: false,
        source: 'A',
        target: 'F',
      },
    },
    zh: {
      title: '最短路径高亮器',
      teaching: `在**加权图**中，每条边都有一个代价。**最短路径**是**总代价最低**的路径——不一定是经过边数最少的路径。\n\n**Dijkstra 算法**可以找到它：从源节点开始，始终扩展代价最小的未访问节点，并记录到达每个节点的最小代价。\n\n⚠️ 陷阱：边数更少的路径总代价可能*更高*，而经过更多边但每条边代价更低的路径反而更短。`,
      description: `点击下图中**从 A 到 F 的最短（最小权重）路径上的边**。\n\n每条边上显示了边权。源节点为 **A**，目标节点为 **F**。\n\n边：A-B(1), A-C(4), B-C(2), B-D(6), C-D(3), C-E(5), D-F(1), E-F(2)`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 160 },
          { id: 'B', x: 190, y: 60  },
          { id: 'C', x: 190, y: 260 },
          { id: 'D', x: 330, y: 160 },
          { id: 'E', x: 330, y: 310 },
          { id: 'F', x: 450, y: 160 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 1 },
          { id: 'A-C', from: 'A', to: 'C', weight: 4 },
          { id: 'B-C', from: 'B', to: 'C', weight: 2 },
          { id: 'B-D', from: 'B', to: 'D', weight: 6 },
          { id: 'C-D', from: 'C', to: 'D', weight: 3 },
          { id: 'C-E', from: 'C', to: 'E', weight: 5 },
          { id: 'D-F', from: 'D', to: 'F', weight: 1 },
          { id: 'E-F', from: 'E', to: 'F', weight: 2 },
        ],
        directed: false,
        source: 'A',
        target: 'F',
      },
    },
    // Dijkstra from A: A→B(1)→C(3)→D(6)→F(7). Trap: A→B→D→F = 8, A→C→D→F = 8
    answer: ['A-B', 'B-C', 'C-D', 'D-F'],
  },

  {
    id: 'graph-05',
    topic: 'graphs',
    difficulty: 'medium',
    points: 10,
    type: 'checkbox-multi',
    en: {
      title: 'Cycle Detector Challenge',
      teaching: `A **cycle** in a graph is a path that starts and ends at the **same node**, visiting at least one other node in between — like a loop.\n\n**Example with cycle:** A–B–C–A *(you can go from A → B → C → back to A)*\n**Example without cycle:** A–B–C *(just a line; no way back to start)*`,
      description: `Which of the following 6 graphs contain a **cycle**? Check all that apply.`,
      data: {
        graphs: [
          {
            id: 'g1', label: 'Graph 1',
            nodes: [{ id: 'A', x: 40, y: 30 }, { id: 'B', x: 120, y: 30 }, { id: 'C', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }],
            directed: false,
          },
          {
            id: 'g2', label: 'Graph 2',
            nodes: [{ id: 'A', x: 40, y: 30 }, { id: 'B', x: 120, y: 30 }, { id: 'C', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }],
            directed: false,
          },
          {
            id: 'g3', label: 'Graph 3',
            nodes: [{ id: 'A', x: 80, y: 20 }, { id: 'B', x: 20, y: 100 }, { id: 'C', x: 80, y: 100 }, { id: 'D', x: 140, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' }],
            directed: false,
          },
          {
            id: 'g4', label: 'Graph 4',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 80, y: 20 }, { id: 'C', x: 140, y: 60 }, { id: 'D', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'B' }],
            directed: false,
          },
          {
            id: 'g5', label: 'Graph 5',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 70, y: 60 }, { id: 'C', x: 120, y: 60 }, { id: 'D', x: 170, y: 60 }, { id: 'E', x: 220, y: 60 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'E' }],
            directed: false,
          },
          {
            id: 'g6', label: 'Graph 6',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 80, y: 20 }, { id: 'C', x: 140, y: 60 }, { id: 'D', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }, { from: 'B', to: 'D' }],
            directed: false,
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
      title: '环检测挑战',
      teaching: `图中的**环**是一条从某节点出发并回到**同一节点**的路径，中间至少经过一个其他节点——就像一个循环。\n\n**有环示例：** A–B–C–A *(可以从 A → B → C → 回到 A)*\n**无环示例：** A–B–C *(只是一条线；无法回到起点)*`,
      description: `以下 6 个图中，哪些包含**环**？选择所有符合条件的选项。`,
      data: {
        graphs: [
          {
            id: 'g1', label: '图 1',
            nodes: [{ id: 'A', x: 40, y: 30 }, { id: 'B', x: 120, y: 30 }, { id: 'C', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }],
            directed: false,
          },
          {
            id: 'g2', label: '图 2',
            nodes: [{ id: 'A', x: 40, y: 30 }, { id: 'B', x: 120, y: 30 }, { id: 'C', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }],
            directed: false,
          },
          {
            id: 'g3', label: '图 3',
            nodes: [{ id: 'A', x: 80, y: 20 }, { id: 'B', x: 20, y: 100 }, { id: 'C', x: 80, y: 100 }, { id: 'D', x: 140, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' }],
            directed: false,
          },
          {
            id: 'g4', label: '图 4',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 80, y: 20 }, { id: 'C', x: 140, y: 60 }, { id: 'D', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'B' }],
            directed: false,
          },
          {
            id: 'g5', label: '图 5',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 70, y: 60 }, { id: 'C', x: 120, y: 60 }, { id: 'D', x: 170, y: 60 }, { id: 'E', x: 220, y: 60 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }, { from: 'D', to: 'E' }],
            directed: false,
          },
          {
            id: 'g6', label: '图 6',
            nodes: [{ id: 'A', x: 20, y: 60 }, { id: 'B', x: 80, y: 20 }, { id: 'C', x: 140, y: 60 }, { id: 'D', x: 80, y: 100 }],
            edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }, { from: 'B', to: 'D' }],
            directed: false,
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
    answer: ['g2', 'g4', 'g6'],
  },

  {
    id: 'graph-06',
    topic: 'graphs',
    difficulty: 'hard',
    points: 15,
    type: 'click-edges',
    en: {
      title: 'Minimum Spanning Tree Builder',
      teaching: `A **Spanning Tree** connects all nodes with no cycles using exactly n-1 edges (where n = number of nodes).\n\nA **Minimum Spanning Tree (MST)** is the spanning tree with the **lowest total edge weight** — like finding the cheapest set of roads to connect all cities.\n\n**Kruskal's rule**: sort all edges by weight, greedily add the cheapest edge that doesn't create a cycle, and repeat until all nodes are connected (n-1 edges selected).`,
      description: `Click the **6 edges** that form the Minimum Spanning Tree for this 7-node weighted graph.\n\nEdge weights are shown on each edge.`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 170 },
          { id: 'B', x: 190, y: 60  },
          { id: 'C', x: 330, y: 60  },
          { id: 'D', x: 190, y: 280 },
          { id: 'E', x: 330, y: 280 },
          { id: 'F', x: 260, y: 390 },
          { id: 'G', x: 450, y: 170 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 7  },
          { id: 'A-D', from: 'A', to: 'D', weight: 5  },
          { id: 'B-C', from: 'B', to: 'C', weight: 8  },
          { id: 'B-D', from: 'B', to: 'D', weight: 9  },
          { id: 'B-E', from: 'B', to: 'E', weight: 7  },
          { id: 'C-E', from: 'C', to: 'E', weight: 5  },
          { id: 'D-E', from: 'D', to: 'E', weight: 15 },
          { id: 'D-F', from: 'D', to: 'F', weight: 6  },
          { id: 'E-F', from: 'E', to: 'F', weight: 8  },
          { id: 'E-G', from: 'E', to: 'G', weight: 9  },
          { id: 'F-G', from: 'F', to: 'G', weight: 11 },
        ],
        directed: false,
        mstCount: 6,
      },
    },
    zh: {
      title: '最小生成树构建器',
      teaching: `**生成树**使用恰好 n-1 条边（n = 节点数）连接所有节点，且无环。\n\n**最小生成树（MST）** 是总边权最小的生成树——就像找到连接所有城市的最便宜道路组合。\n\n**Kruskal 法则**：将所有边按权重排序，贪心地添加不会产生环的最便宜边，重复操作直到所有节点都连通（选取 n-1 条边）。`,
      description: `点击构成这个 7 节点加权图的最小生成树的 **6 条边**。\n\n每条边上显示了边权。`,
      data: {
        nodes: [
          { id: 'A', x: 60,  y: 170 },
          { id: 'B', x: 190, y: 60  },
          { id: 'C', x: 330, y: 60  },
          { id: 'D', x: 190, y: 280 },
          { id: 'E', x: 330, y: 280 },
          { id: 'F', x: 260, y: 390 },
          { id: 'G', x: 450, y: 170 },
        ],
        edges: [
          { id: 'A-B', from: 'A', to: 'B', weight: 7  },
          { id: 'A-D', from: 'A', to: 'D', weight: 5  },
          { id: 'B-C', from: 'B', to: 'C', weight: 8  },
          { id: 'B-D', from: 'B', to: 'D', weight: 9  },
          { id: 'B-E', from: 'B', to: 'E', weight: 7  },
          { id: 'C-E', from: 'C', to: 'E', weight: 5  },
          { id: 'D-E', from: 'D', to: 'E', weight: 15 },
          { id: 'D-F', from: 'D', to: 'F', weight: 6  },
          { id: 'E-F', from: 'E', to: 'F', weight: 8  },
          { id: 'E-G', from: 'E', to: 'G', weight: 9  },
          { id: 'F-G', from: 'F', to: 'G', weight: 11 },
        ],
        directed: false,
        mstCount: 6,
      },
    },
    // Kruskal sorted: A-D(5),C-E(5),D-F(6),A-B(7),B-E(7),B-C(8→skip cycle?),E-F(8→skip),E-G(9)
    // Sets: {A},{B},{C},{D},{E},{F},{G}
    // A-D(5)→{A,D}, C-E(5)→{C,E}, D-F(6)→{A,D,F}, A-B(7)→{A,B,D,F}, B-E(7)→{A,B,C,D,E,F}, E-G(9)→{A,B,C,D,E,F,G} ✓
    answer: ['A-D', 'C-E', 'D-F', 'A-B', 'B-E', 'E-G'],
  },

  {
    id: 'graph-07',
    topic: 'graphs',
    difficulty: 'hard',
    points: 15,
    type: 'drag-order',
    en: {
      title: 'Topological Sort — Math Curriculum',
      teaching: `A **Directed Acyclic Graph (DAG)** is a directed graph with no cycles. **Topological Sort** produces a linear ordering of all nodes where for every edge A → B, node A appears **before** node B.\n\n**Kahn's Algorithm** (track step-by-step):\n1. Compute the **in-degree** (number of incoming edges) of every node.\n2. Put all nodes with in-degree **0** into a queue — they have no prerequisites.\n3. Remove a node from the queue → add it to your result → **decrease** the in-degree of each of its neighbors by 1.\n4. If a neighbor's in-degree reaches **0**, add it to the queue.\n5. Repeat until the queue is empty.\n\n**Tip:** Make a small table of in-degrees and update it as you process each course. A course with **two** prerequisites can only be taken after **both** are done — missing one gives an invalid ordering!`,
      description: `You are planning a math curriculum. Each course can only be taken after **all** its prerequisite courses have been completed.\n\n**Prerequisite edges (→ means "must complete before"):**\n- Calculus I → Linear Algebra\n- Precalculus → Calculus II\n- Calculus I → Calculus II\n- Linear Algebra → Probability\n- Linear Algebra → Multivariable Calc\n- Calculus II → Multivariable Calc\n- Probability → Math Statistics\n- Multivariable Calc → Math Statistics\n- Math Statistics → Stochastic Proc\n\n**Starting in-degrees to help you begin:**\nPrecalculus: 0 · Calculus I: 0 · Linear Algebra: 1 · Calculus II: 2 · Probability: 1 · Multivariable Calc: 2 · Math Statistics: 2 · Stochastic Proc: 1\n\n**Drag the 8 courses into a valid enrollment order (left = first, right = last).**`,
      data: {
        nodes: [
          { id: 'Precalculus',       x: 60,  y: 60  },
          { id: 'Calculus I',        x: 60,  y: 220 },
          { id: 'Linear Algebra',    x: 240, y: 220 },
          { id: 'Calculus II',       x: 240, y: 60  },
          { id: 'Probability',       x: 420, y: 260 },
          { id: 'Multivariable Calc',x: 420, y: 80  },
          { id: 'Math Statistics',   x: 590, y: 170 },
          { id: 'Stochastic Proc',   x: 750, y: 170 },
        ],
        edges: [
          { from: 'Calculus I',         to: 'Linear Algebra'     },
          { from: 'Precalculus',        to: 'Calculus II'        },
          { from: 'Calculus I',         to: 'Calculus II'        },
          { from: 'Linear Algebra',     to: 'Probability'        },
          { from: 'Linear Algebra',     to: 'Multivariable Calc' },
          { from: 'Calculus II',        to: 'Multivariable Calc' },
          { from: 'Probability',        to: 'Math Statistics'    },
          { from: 'Multivariable Calc', to: 'Math Statistics'    },
          { from: 'Math Statistics',    to: 'Stochastic Proc'    },
        ],
        directed: true,
        pool: ['Precalculus', 'Calculus I', 'Linear Algebra', 'Calculus II', 'Probability', 'Multivariable Calc', 'Math Statistics', 'Stochastic Proc'],
        slots: 8,
        layout: 'horizontal',
      },
    },
    zh: {
      title: '拓扑排序 — 数学课程规划',
      teaching: `**有向无环图（DAG）** 是没有环的有向图。**拓扑排序**产生所有节点的线性序列，使得对每条边 A → B，A 都出现在 B **之前**。\n\n**Kahn 算法**（逐步追踪）：\n1. 计算每个节点的**入度**（入边数量）。\n2. 将入度为 **0** 的节点加入队列——它们没有先决条件。\n3. 从队列取出一个节点 → 加入结果序列 → 将其所有邻居的入度 **减 1**。\n4. 若某邻居入度变为 **0**，将其加入队列。\n5. 重复直到队列为空。\n\n**提示：** 制作一个入度表并在处理每门课程时更新它。有**两个**先修课程的课只有在**两者都完成**后才能选修——漏掉任何一个都会得到无效的顺序！`,
      description: `你正在规划一份数学课程表。每门课程只能在其**所有**先修课程完成后才能选修。\n\n**先修关系（→ 表示"必须先完成"）：**\n- 微积分 I → 线性代数\n- 预备微积分 → 微积分 II\n- 微积分 I → 微积分 II\n- 线性代数 → 概率论\n- 线性代数 → 多变量微积分\n- 微积分 II → 多变量微积分\n- 概率论 → 数理统计\n- 多变量微积分 → 数理统计\n- 数理统计 → 随机过程\n\n**初始入度参考：**\n预备微积分: 0 · 微积分 I: 0 · 线性代数: 1 · 微积分 II: 2 · 概率论: 1 · 多变量微积分: 2 · 数理统计: 2 · 随机过程: 1\n\n**将 8 门课程拖入有效的选修顺序（左 = 最先，右 = 最后）。**`,
      data: {
        nodes: [
          { id: 'Precalculus',       x: 60,  y: 60  },
          { id: 'Calculus I',        x: 60,  y: 220 },
          { id: 'Linear Algebra',    x: 240, y: 220 },
          { id: 'Calculus II',       x: 240, y: 60  },
          { id: 'Probability',       x: 420, y: 260 },
          { id: 'Multivariable Calc',x: 420, y: 80  },
          { id: 'Math Statistics',   x: 590, y: 170 },
          { id: 'Stochastic Proc',   x: 750, y: 170 },
        ],
        edges: [
          { from: 'Calculus I',         to: 'Linear Algebra'     },
          { from: 'Precalculus',        to: 'Calculus II'        },
          { from: 'Calculus I',         to: 'Calculus II'        },
          { from: 'Linear Algebra',     to: 'Probability'        },
          { from: 'Linear Algebra',     to: 'Multivariable Calc' },
          { from: 'Calculus II',        to: 'Multivariable Calc' },
          { from: 'Probability',        to: 'Math Statistics'    },
          { from: 'Multivariable Calc', to: 'Math Statistics'    },
          { from: 'Math Statistics',    to: 'Stochastic Proc'    },
        ],
        directed: true,
        pool: ['Precalculus', 'Calculus I', 'Linear Algebra', 'Calculus II', 'Probability', 'Multivariable Calc', 'Math Statistics', 'Stochastic Proc'],
        slots: 8,
        layout: 'horizontal',
      },
    },
    // Any valid topological order; validated dynamically via Kahn's constraint check
    answer: null, // special: validated by checking DAG constraints
  },
];

export function validateAnswer(problem: Problem, submitted: unknown): boolean {
  const correct = problem.answer;

  if (problem.type === 'drag-priority' || problem.type === 'drag-order' || problem.type === 'click-sequence') {
    // Ordered comparison: must match exact sequence
    if (!Array.isArray(correct) || !Array.isArray(submitted)) return false;
    return JSON.stringify(correct) === JSON.stringify(submitted);
  }

  if (problem.id === 'graph-07') {
    // Topological sort: validate submitted ordering against DAG edges
    const order = submitted as string[];
    if (!Array.isArray(order) || order.length !== 8) return false;
    const edges = (problem.en.data as { edges: { from: string; to: string }[] }).edges;
    for (const edge of edges) {
      const fromIdx = order.indexOf(edge.from);
      const toIdx = order.indexOf(edge.to);
      if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) return false;
    }
    return true;
  }

  if (Array.isArray(correct) && Array.isArray(submitted)) {
    // For fill-matrix: compare sorted arrays of pairs
    if (correct.length > 0 && Array.isArray(correct[0])) {
      const sortPair = (a: unknown[]) => JSON.stringify(a);
      const correctSet = new Set((correct as unknown[][]).map(sortPair));
      const submittedArr = submitted as unknown[][];
      if (submittedArr.length !== correct.length) return false;
      return submittedArr.every(pair => correctSet.has(sortPair(pair as unknown[])));
    }
    // For click-edges, checkbox-multi, click-cells: order-independent set comparison
    if (
      (typeof correct[0] === 'string' && typeof (submitted as unknown[])[0] === 'string') ||
      (typeof correct[0] === 'number' && typeof (submitted as unknown[])[0] === 'number')
    ) {
      const correctSet = new Set(correct as (string | number)[]);
      const submittedSet = new Set(submitted as (string | number)[]);
      if (correctSet.size !== submittedSet.size) return false;
      for (const v of correctSet) if (!submittedSet.has(v)) return false;
      return true;
    }
    if (JSON.stringify(correct) !== JSON.stringify(submitted)) return false;
    return true;
  }

  if (typeof correct === 'object' && correct !== null && !Array.isArray(correct)) {
    // For drag-match: key-value map comparison
    const c = correct as Record<string, string>;
    const s = submitted as Record<string, string>;
    for (const key of Object.keys(c)) {
      if (c[key] !== s?.[key]) return false;
    }
    return true;
  }

  // For multi-choice: string equality, for click-bug: number equality
  return correct === submitted;
}
