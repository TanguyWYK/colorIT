"use strict";

function solveColorIt(input, formula) {
  let nbOfTurn = 0;
  let response = [];

  // Identification du nombre de case n et du nombre de couleur p
  const n = input[0].length;
  let max = 0;
  input.forEach((line) => {
    let value = Math.max(...line);
    if (value > max) {
      max = value;
    }
  });
  const p = max + 1;

  // Pronfondeur de recherche dans l'arbre de décision réduite si tableau grand
  const DEEP = n > 130 ? 0 : n > 100 ? 1 : 2;

  // Liste de tous les regroupements de couleurs
  let clusters = Array.from(Array(p), () => new Array(0));
  fillClusters();

  // Construction des branches de l'arbre de décision :
  // - une branche est un groupe de couleur avec les groupes adjacents en enfants
  let branches = generateBranches();
  addChildrenToBranches();
  clusters = []; // vide la variable

  // On fusionne les groupes en fonction de la couleur choisie
  // fin de la résolution lorsqu'il reste un seul groupe
  while (Object.keys(branches).length > 1) {
    let firstBranchId = findBranchIdByBlockId(0);
    let firstBranch = branches[firstBranchId];
    let bestBranch = findBestChild(firstBranch);
    response.push(branches[bestBranch].color);
    fusionBranches(firstBranchId, bestBranch);
    nbOfTurn++;
  }
  console.log("Algo" + formula + " nb of turn: ", nbOfTurn);
  return response;

  function findBestChild(parentBranch) {
    let children = [];
    for (let child of parentBranch.children) {
      children.push({
        id: child,
        color: branches[child].color,
        parentColor: parentBranch.color,
        score: scoreChild(branches[child], DEEP, 0, 0),
      });
    }
    let max = 0;
    let bestChild = children[0];
    for (let child of children) {
      //console.log(child.score);
      if (child.score > max) {
        bestChild = child;
        max = child.score;
      }
    }
    return bestChild.id;
  }

  function scoreChild(branch, deep, turn, score) {
    if (deep === turn) {
      let sameColor = {};
      let max = 0;
      for (let child of branch.children) {
        let color = branches[child].color;
        if (sameColor.hasOwnProperty(color)) {
          sameColor[color]++;
        } else {
          sameColor[color] = 1;
        }
        if (sameColor[color] > max) {
          max = sameColor[color];
        }
      }
      if (formula === 0) {
        return score + max * 2 ** (deep - turn);
      } else if (formula === 1) {
        return (
          score + Math.max(max * 2 ** (deep - turn), 2 ** (deep - turn + 1))
        );
      } else if (formula === 2) {
        return score + (max - 1) * 10 ** (deep - turn);
      }
    } else {
      for (let child of branch.children) {
        score += scoreChild(branches[child], deep, turn + 1, score);
      }
    }
    return score;
  }

  function fusionBranches(id1, id2) {
    // la branche id2 sera fusionnée dans la branche id1

    // Mise à jour couleur
    branches[id1].color = branches[id2].color;

    // Fusion des blocks
    let blocksFusionned = branches[id1].blocks.concat(branches[id2].blocks);
    branches[id1].blocks = blocksFusionned;

    // Fusion des children
    branches[id2].children.forEach((child) => {
      if (!branches[id1].children.includes(child) && child !== id1) {
        branches[id1].children.push(child);
      }
    });

    // Suppression de la branche id2
    delete branches[id2];

    // Mise à jour des autres branches
    for (let branchId in branches) {
      let branch = branches[branchId];
      if (branch.children.includes(id2)) {
        let index = branch.children.findIndex((element) => element === id2);
        branch.children.splice(index, 1);
        if (!branch.children.includes(id1) && branchId !== id1) {
          branch.children.push(id1);
        }
      }
    }

    for (let child of branches[id1].children) {
      if (branches[child].color === branches[id1].color) {
        fusionBranches(id1, child);
      }
    }
  }

  function fillClusters() {
    let visited = Array.from(Array(n), () => new Array(n).fill(false));
    let activeColor = input[0][0];
    let cluster = [];
    let isNewCluster = true;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!visited[i][j]) {
          if (input[i][j] !== activeColor || isNewCluster) {
            visited[i][j] = true;
            if (cluster.length > 0) {
              clusters[activeColor].push(cluster);
            }
            cluster = [generateId(i, j)];
            activeColor = input[i][j];
          }
          lookAround(i, j, activeColor, cluster, visited);
        }
        isNewCluster = true;
      }
    }
    if (cluster.length > 0) {
      clusters[activeColor].push(cluster);
    }
  }

  function generateBranches() {
    let elements = {};
    let id = 0;
    for (let color in clusters) {
      for (let cluster of clusters[color]) {
        elements[id] = {
          color: color,
          blocks: cluster,
          children: [],
        };
        id++;
      }
    }
    return elements;
  }

  function lookAround(i, j, color, cluster, visited) {
    if (i > 0 && !visited[i - 1][j] && input[i - 1][j] === color) {
      visited[i - 1][j] = true;
      cluster.push(generateId(i - 1, j));
      lookAround(i - 1, j, color, cluster, visited);
    }
    if (i < n - 1 && !visited[i + 1][j] && input[i + 1][j] === color) {
      visited[i + 1][j] = true;
      cluster.push(generateId(i + 1, j));
      lookAround(i + 1, j, color, cluster, visited);
    }
    if (j > 0 && !visited[i][j - 1] && input[i][j - 1] === color) {
      visited[i][j - 1] = true;
      cluster.push(generateId(i, j - 1));
      lookAround(i, j - 1, color, cluster, visited);
    }
    if (j < n - 1 && !visited[i][j + 1] && input[i][j + 1] === color) {
      visited[i][j + 1] = true;
      cluster.push(generateId(i, j + 1));
      lookAround(i, j + 1, color, cluster, visited);
    }
  }

  function generateId(i, j) {
    return i * n + j;
  }

  function findBranchIdByBlockId(blockId) {
    for (let branchId in branches) {
      if (branches[branchId].blocks.includes(blockId)) {
        return branchId;
      }
    }
    return undefined;
  }

  function addChildrenToBranches() {
    for (let branchId in branches) {
      let children = [];
      let branch = branches[branchId];
      for (let blockId of branch.blocks) {
        let neighbours = findNeighboursOfOneBlock(blockId);
        for (let neighbour of neighbours) {
          if (!branch.blocks.includes(neighbour)) {
            let branchId = findBranchIdByBlockId(neighbour);
            if (!children.includes(branchId)) {
              children.push(branchId);
            }
          }
        }
      }
      branch.children = children;
    }
  }

  function findNeighboursOfOneBlock(blockId) {
    let i = Math.floor(blockId / n);
    let j = blockId - i * n;
    let neighbours = [];
    if (i > 0) {
      neighbours.push(generateId(i - 1, j));
    }
    if (i < n - 1) {
      neighbours.push(generateId(i + 1, j));
    }
    if (j > 0) {
      neighbours.push(generateId(i, j - 1));
    }
    if (j < n - 1) {
      neighbours.push(generateId(i, j + 1));
    }
    return neighbours;
  }
}
