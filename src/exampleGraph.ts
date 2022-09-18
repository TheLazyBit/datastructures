import { Graph } from './math/Graph';
import { GraphLayout } from './features/graph/BaseGraphRenderer';

const graph = {
  graph: {
    nodes: [
      {
        id: 1,
        data: 'S',
      },
      {
        id: 2,
        data: '2',
      },
      {
        id: 3,
        data: '3',
      },
      {
        id: 4,
        data: '4',
      },
      {
        id: 5,
        data: '5',
      },
      {
        id: 7,
        data: '7',
      },
      {
        id: 8,
        data: '8',
      },
      {
        id: 9,
        data: '9',
      },
      {
        id: 10,
        data: '10',
      },
      {
        id: 11,
        data: '11',
      },
      {
        id: 12,
        data: 'E',
      },
      {
        id: 13,
        data: '13',
      },
      {
        id: 14,
        data: '14',
      },
      {
        id: 15,
        data: '15',
      },
      {
        id: 16,
        data: '16',
      },
    ],
    edges: [
      {
        from: 1,
        to: 2,
      },
      {
        from: 2,
        to: 1,
      },
      {
        from: 3,
        to: 2,
      },
      {
        from: 2,
        to: 3,
      },
      {
        from: 4,
        to: 3,
      },
      {
        from: 3,
        to: 4,
      },
      {
        from: 5,
        to: 1,
      },
      {
        from: 1,
        to: 5,
      },
      {
        from: 7,
        to: 3,
      },
      {
        from: 3,
        to: 7,
      },
      {
        from: 8,
        to: 7,
      },
      {
        from: 8,
        to: 4,
      },
      {
        from: 4,
        to: 8,
      },
      {
        from: 7,
        to: 8,
      },
      {
        from: 9,
        to: 5,
      },
      {
        from: 9,
        to: 10,
      },
      {
        from: 9,
        to: 13,
      },
      {
        from: 5,
        to: 9,
      },
      {
        from: 10,
        to: 9,
      },
      {
        from: 13,
        to: 9,
      },
      {
        from: 10,
        to: 11,
      },
      {
        from: 10,
        to: 14,
      },
      {
        from: 11,
        to: 10,
      },
      {
        from: 14,
        to: 10,
      },
      {
        from: 11,
        to: 12,
      },
      {
        from: 11,
        to: 7,
      },
      {
        from: 11,
        to: 15,
      },
      {
        from: 11,
        to: 11,
      },
      {
        from: 12,
        to: 11,
      },
      {
        from: 7,
        to: 11,
      },
      {
        from: 12,
        to: 8,
      },
      {
        from: 12,
        to: 16,
      },
      {
        from: 16,
        to: 12,
      },
      {
        from: 8,
        to: 12,
      },
      {
        from: 13,
        to: 14,
      },
      {
        from: 14,
        to: 13,
      },
      {
        from: 14,
        to: 15,
      },
      {
        from: 15,
        to: 14,
      },
      {
        from: 15,
        to: 16,
      },
      {
        from: 16,
        to: 15,
      },
      {
        from: 15,
        to: 11,
      },
    ],
  },
  layout: {
    1: {
      x: 86,
      y: 60,
    },
    2: {
      x: 226,
      y: 60,
    },
    3: {
      x: 369,
      y: 60,
    },
    4: {
      x: 513,
      y: 61,
    },
    5: {
      x: 82,
      y: 189,
    },
    7: {
      x: 366,
      y: 190,
    },
    8: {
      x: 514,
      y: 193,
    },
    9: {
      x: 79,
      y: 339,
    },
    10: {
      x: 221,
      y: 335,
    },
    11: {
      x: 371,
      y: 334,
    },
    12: {
      x: 517,
      y: 331,
    },
    13: {
      x: 80,
      y: 487,
    },
    14: {
      x: 222,
      y: 481,
    },
    15: {
      x: 373,
      y: 479,
    },
    16: {
      x: 520,
      y: 475,
    },
  },
};

export default graph as { graph: Graph<string>, layout: GraphLayout };
