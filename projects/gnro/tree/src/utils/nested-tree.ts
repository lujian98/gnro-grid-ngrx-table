import { GnroTreeNode } from '../models/tree-grid.model';

export function gnroFlattenTree<T>(nodes: GnroTreeNode<T>[], level: number): GnroTreeNode<T>[] {
  const flattenedNodes: GnroTreeNode<T>[] = [];
  for (const node of nodes) {
    const leaf = node.children ? false : true; // TODO remote node leaf???
    flattenedNodes.push({ ...node, level, leaf });
    if (node.children && node.expanded) {
      flattenedNodes.push(...gnroFlattenTree(node.children, level + 1));
    }
  }
  return flattenedNodes;
}

export function gnroNodeToggleInMemoryData<T>(nodes: GnroTreeNode<T>[], n: GnroTreeNode<T>): GnroTreeNode<T>[] {
  return [...nodes].map((node) => {
    return {
      ...node,
      expanded: node.name === n.name ? !node.expanded : node.expanded,
      children: node.children ? gnroNodeToggleInMemoryData(node.children, n) : undefined,
    };
  });
}

export function gnroExpandAllNodesInMemoryData<T>(nodes: GnroTreeNode<T>[], expanded: boolean): GnroTreeNode<T>[] {
  return [...nodes].map((node) => {
    return {
      ...node,
      expanded: node.children ? expanded : undefined,
      children: node.children ? gnroExpandAllNodesInMemoryData(node.children, expanded) : undefined,
    };
  });
}

export function gnroSetNestNodeId<T>(nodes: GnroTreeNode<T>[]): GnroTreeNode<T>[] {
  return [...nodes].map((node) => {
    return {
      ...node,
      id: node.id ? node.id : node.name,
      children: node.children ? gnroSetNestNodeId(node.children) : undefined,
    };
  });
}

export function gnroFindNodeId<T>(id: string, nodes: GnroTreeNode<T>[]): GnroTreeNode<T> | null {
  let find: GnroTreeNode<T> | null = null;
  [...nodes].forEach((node) => {
    if (node.id === id) {
      find = node;
    } else if (node.children && !find) {
      find = gnroFindNodeId(id, node.children);
    }
  });
  return find;
}

export function gnroGetNodeParent<T>(n: GnroTreeNode<T>, nodes: GnroTreeNode<T>[]): GnroTreeNode<T> | undefined {
  return [...nodes].find((node) => node.children?.find((cn: GnroTreeNode<T>) => cn.id === n.id));
}

export function gnroRemoveNestedNode<T>(nodes: GnroTreeNode<T>[], n: GnroTreeNode<T>): GnroTreeNode<T>[] {
  return [...nodes]
    .filter((node) => node.id !== n.id)
    .map((node) => {
      const children = node.children?.length ? gnroRemoveNestedNode(node.children, n) : undefined;
      return {
        ...node,
        children: children && children.length > 0 ? children : undefined,
      };
    });
}

export function gnroAddNestedTreeNode<T>(
  nodes: GnroTreeNode<T>[],
  n: GnroTreeNode<T>,
  targetParent: GnroTreeNode<T>,
  targetIndex: number,
): GnroTreeNode<T>[] {
  if (!targetParent) {
    nodes.splice(targetIndex, 0, n);
    return [...nodes];
  } else {
    return [...nodes].map((node) => {
      let children = node.children;
      if (node.id === targetParent.id) {
        children = node.children ? node.children : [];
        children.splice(targetIndex, 0, n);
      }
      return {
        ...node,
        children: children ? gnroAddNestedTreeNode(children, n, targetParent, targetIndex) : undefined,
      };
    });
  }
}
