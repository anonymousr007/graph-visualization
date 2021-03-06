Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function isComplexGraph() {
	for(i = 0; i < g.edges.length; i++) {
		if(g.edges[i]['source'] == g.edges[i]['target']) {
			alert("Graph has a loop, not able to run algorithms");
			return true;
		}
	}
	graphstr = g.edges.map(a => [a.source, a.target].sort().toString().replace(',',''))
	if( new Set(graphstr).size != graphstr.length) {
		alert("Graph has parallel edges, not able to run algorithms");
		return true;
	}
	return false;
}

function nodeIDToNodeLabel(node_id) {
	for(var j = 0; j < g.nodes.length; j++) {
		if(node_id == g.nodes[j]['id']) {
			return g.nodes[j]['label'];
		}
	}
	return "";
}

function nodeIDToNodeI(node_id) {
	for(var j = 0; j < g.nodes.length; j++) {
		if(node_id == g.nodes[j]['id']) {
			return j;
		}
	}
	return "";
}

function zoomIn() {
	var cam = s.camera;
	sigma.misc.animation.camera(cam, {
		ratio: cam.ratio / cam.settings('zoomingRatio')
	}, {
		duration: s.settings('animationsTime')
	});
}

function zoomOut() {
	var cam = s.camera;
	sigma.misc.animation.camera(cam, {
		ratio: cam.ratio * cam.settings('zoomingRatio')
	}, {
		duration: s.settings('animationsTime')
	});
}

function showEdges() {
	if(s.settings('drawEdges') == false) { 
		s.settings('drawEdges',true);
		$('#show_edges')[0].checked = true;
		$('#show_edges_alt')[0].checked = true;
	} else {
		s.settings('drawEdges',false);
		$('#show_edges')[0].checked = false;
		$('#show_edges_alt')[0].checked = false;
	}
	s.refresh();
}

function showNodes() {
	if(s.settings('drawNodes') == false) { 
		s.settings('drawNodes',true);
		$('#show_nodes')[0].checked = true;
		$('#show_nodes_alt')[0].checked = true;
	} else {
		s.settings('drawNodes',false);
		$('#show_nodes')[0].checked = false;
		$('#show_nodes_alt')[0].checked = false;
	}
	s.refresh();
}

function showEdgeLabels() {
	if(s.settings('drawEdgeLabels') == false) { 
		s.settings('drawEdgeLabels',true);
		$('#edge_labels')[0].checked = true;
		$('#edge_labels_alt')[0].checked = true;
	} else {
		s.settings('drawEdgeLabels',false);
		$('#edge_labels')[0].checked = false;
		$('#edge_labels_alt')[0].checked = false;
	}
	s.refresh();
}

function showNodesLabels() {
	if(s.settings('drawLabels') == false) { 
		s.settings('drawLabels',true);
		$('#node_labels')[0].checked = true;
		$('#node_labels_alt')[0].checked = true;
	} else {
		s.settings('drawLabels',false);
		$('#node_labels')[0].checked = false;
		$('#node_labels_alt')[0].checked = false;
	}
	s.refresh();
}

function regenColors() {
	colorArray = shuffle(colorArray);
	redrawGraph(true);
}

function resetEdgeColors() {
	for(var i = 0; i < g.edges.length; i++) {
		g.edges[i]['size'] = 4;
		g.edges[i]['color'] = '#000';
	}
	
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function randomizeWeights() {
	
	resetEdgeColors();

	var min = 1;
	var max = 20;
	for(var i = 0; i < g.edges.length; i++) {
		g.edges[i].label = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
	}
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function downloadGraph() {
	s.renderers[0].snapshot({format: 'png', labels: true, download: true, filename: 'graph.png' });
}

function importGraph() {
	$('#aGraph').click();
	try {	
		graphStatistics();
	
		$('#importexport_modal').modal('toggle');
		
		g = JSON.parse($('#import_data')[0].value);
		
		s.graph.clear();
		s.graph.read(g);
		s.refresh();
	} catch (err) {
		alert("Unable to import graph");
	}
}

function graphStatistics() {
	$('#vertex_count')[0].textContent = g.nodes.length;
	$('#vertex_count_alt')[0].textContent = g.nodes.length;
	$('#edge_count')[0].textContent = g.edges.length;
	$('#edge_count_alt')[0].textContent = g.edges.length;
}

var g;

s = new sigma({
	graph: g,
	renderer: {
		container: document.getElementById('graph-container'),
		type: 'canvas'
	},
	settings: {
		sideMargin: 1,
		drawEdgeLabels: 0,
		defaultEdgeLabelSize: 15,
		maxEdgeSize: 4,
	}
});

var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
dragListener.bind('dragend', function(event) {
	for(var i = 0; i < g.nodes.length; i++) {
		if(event.data.node.id == g.nodes[i]['id']) {
			g.nodes[i]['x'] = event.data.node.x;
			g.nodes[i]['y'] = event.data.node.y;
			break;
		}
	}
});

function redrawGraph(no_a_kill) {
	if(no_a_kill == 1 && $('input[type=radio][name=graphTypes]:checked').val() == "a") {
		return;
	}
	switch($('input[type=radio][name=graphTypes]:checked').val()) {
		case 'c':
			drawC();
			break;
		case 'w':
			drawW();
			break;
		case 'k':
			drawK();
			break;
		case 'kk':
			drawKK();
			break;
		case 'q':
			drawQ();
			break;
		case 'a':
			drawA();
			break;
	}
	graphStatistics();
}

var labels = [];
for( var i = 65; i < 91; i++ ) {
    labels.push( String.fromCharCode( i ) );
}
for( var i = 65; i < 91; i++ ) {
    for( var j = 65; j < 91; j++ ) {
		labels.push( String.fromCharCode( i ) + String.fromCharCode( j ) );
	}
}

var colorArray = ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FFEB3B', '#FF9800', '#795548', '#607D8B', '#ffebee', '#F3E5F5', '#E8EAF6', '#E1F5FE', '#E0F2F1', '#F1F8E9', '#FFFDE7', '#FFF3E0', '#EFEBE9', '#ECEFF1', '#ffcdd2', '#E1BEE7', '#C5CAE9', '#B3E5FC', '#B2DFDB', '#DCEDC8', '#FFF9C4', '#FFE0B2', '#D7CCC8', '#CFD8DC', '#ef9a9a', '#CE93D8', '#9FA8DA', '#81D4FA', '#80CBC4', '#C5E1A5', '#FFF59D', '#FFCC80', '#BCAAA4', '#B0BEC5', '#e57373', '#BA68C8', '#7986CB', '#4FC3F7', '#4DB6AC', '#AED581', '#FFF176', '#FFB74D', '#A1887F', '#90A4AE', '#ef5350', '#AB47BC', '#5C6BC0', '#29B6F6', '#26A69A', '#9CCC65', '#FFEE58', '#FFA726', '#8D6E63', '#78909C', '#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FFEB3B', '#FF9800', '#795548', '#607D8B', '#e53935', '#8E24AA', '#3949AB', '#039BE5', '#00897B', '#7CB342', '#FDD835', '#FB8C00', '#6D4C41', '#546E7A', '#d32f2f', '#7B1FA2', '#303F9F', '#0288D1', '#00796B', '#689F38', '#FBC02D', '#F57C00', '#5D4037', '#455A64', '#c62828', '#6A1B9A', '#283593', '#0277BD', '#00695C', '#558B2F', '#F9A825', '#EF6C00', '#4E342E', '#37474F', '#b71c1c', '#4A148C', '#1A237E', '#01579B', '#004D40', '#33691E', '#F57F17', '#E65100', '#3E2723', '#263238', '#ff8a80', '#EA80FC', '#8C9EFF', '#80D8FF', '#A7FFEB', '#CCFF90', '#FFFF8D', '#FFD180', '', '#ff5252', '#E040FB', '#536DFE', '#40C4FF', '#64FFDA', '#B2FF59', '#FFFF00', '#FFAB40', '#ff1744', '#D500F9', '#3D5AFE', '#00B0FF', '#1DE9B6', '#76FF03', '#FFEA00', '#FF9100', '#d50000', '#AA00FF', '#304FFE', '#0091EA', '#00BFA5', '#64DD17', '#FFD600', '#FF6D00'];
regenColors();
//var colorArray = ["#ff9800","#00ff98","#9800ff","#e7ff00","#ff1900","#0067ff","#259b24"];
//"#ca2100","#E91E63","#9C27B0","#2196F3","#3F51B5","#009688","#EF6C00","#43A047"

function drawC() {
	var graph_size = parseInt(document.getElementById('graph_size').value);
	
	if(graph_size < 1) {
		alert("C graph n must be greater than 0");
		return;
	} else if(graph_size > 100) {
		alert("C graph n must be less than 100");
		return;
	}
	
	var coords = [];
	var cN = graph_size;

	var step = 2*Math.PI/cN;
	for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
		coords.push( [Math.cos(theta), Math.sin(theta)] );
	}

	var i;
	g = { nodes: [], edges: [] };

	for(i = 0; i < cN; i++) {
		if(i != cN - 1 || cN % 2 == 0) {
			g.nodes.push( {id: 'n' + i, label: labels[i], x: coords[i][0], y: coords[i][1], size: 20, color: (i % 2 == 0 ? colorArray[0] : colorArray[1]) } );
		} else {
			g.nodes.push( {id: 'n' + i, label: labels[i], x: coords[i][0], y: coords[i][1], size: 20, color: colorArray[2] } );
		}
	}

	for(i = 0; i < cN-1; i++) {
		g.edges.push( {id: 'e' + i, label: "1", source: 'n' + i, target: 'n' + (i + 1), size: 1, color: '#000'} );
	}
	g.edges.push( {id: 'e' + i, label: "1", source: 'n' + i, target: 'n0', size: 1, color: '#000'} );

	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function drawW() {
	var graph_size = parseInt(document.getElementById('graph_size').value);
	
	if(graph_size < 3) {
		alert("Wheel graph n must be greater than 2");
		return;
	} else if(graph_size > 100) {
		alert("Wheel graph n must be less than 100");
		return;
	}
	
	var coords = [];
	var wN = graph_size;

	var step = 2*Math.PI/wN;
	for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
		coords.push( [Math.cos(theta), Math.sin(theta)] );
	}

	var i;
	g = { nodes: [], edges: [] };
	var mCoordX = 0;
	var mCoordY = 0;

	for(i = 0; i < wN; i++) {
		if(i != wN - 1 || wN % 2 == 0) {
			g.nodes.push( {id: 'n' + i, label: labels[i], x: coords[i][0], y: coords[i][1], size: 20, color: (i % 2 == 0 ? colorArray[0] : colorArray[1]) } );
		} else {
			g.nodes.push( {id: 'n' + i, label: labels[i], x: coords[i][0], y: coords[i][1], size: 20, color: colorArray[2] } );
		}
		mCoordX += coords[i][0];
		mCoordY += coords[i][1];
	}
	g.nodes.push( {id: 'n' + i, label: labels[i], x: mCoordX/wN, y: mCoordY/wN, size: 20, color: colorArray[3] } );

	for(i = 0; i < wN-1; i++) {
		g.edges.push( {id: 'e' + i, label: "1", source: 'n' + i, target: 'n' + (i + 1), size: 1, color: '#000'} );
	}
	g.edges.push( {id: 'e' + i, label: "1", source: 'n' + i, target: 'n0', size: 1, color: '#000'} );
	
	for(i = 0; i < wN; i++) {
		g.edges.push( {id: 'e' + (wN+i), label: "1", source: 'n' + wN, target: 'n' + i, size: 1, color: '#000'} );
	}
	
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function drawK() {
	var graph_size = parseInt(document.getElementById('graph_size').value);
	
	if(graph_size < 1) {
		alert("K graph n must be greater than 0");
		return;
	} else if(graph_size > 100) {
		alert("K graph n must be less than 100");
		return;
	}
	
	var coords = [];
	var kN = graph_size;

	var step = 2*Math.PI/kN;
	for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
		coords.push( [Math.cos(theta), Math.sin(theta)] );
	}

	var i;
	g = { nodes: [], edges: [] };

	for(i = 0; i < kN; i++) {
		g.nodes.push( {id: 'n' + i, label: labels[i], x: coords[i][0], y: coords[i][1], size: 20, color: colorArray[i] } );
	}
	
	var edge_cnt = 0;
	for(i = 0; i < kN-1; i++) {
		for(var j = i; j < kN; j++) {
			if(i != j) {
				g.edges.push( {id: 'e' + edge_cnt, label: "1", source: 'n' + i, target: 'n' + j, size: 1, color: '#000'} );
				edge_cnt += 1;
			}
		}
	}

	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function drawKK() {
	var graph_size = parseInt(document.getElementById('graph_size').value);
	var graph_size_alt = parseInt(document.getElementById('graph_size_alt').value);
	
	if(graph_size < 1 || graph_size_alt < 1) {
		alert("Kij graph i/j must be greater than 0");
		return;
	} else if(graph_size > 100 || graph_size_alt > 100) {
		alert("Kij graph i/j must be less than 100");
		return;
	}
	
	var coordsK1 = [];
	var coordsK2 = [];
	var kI = graph_size;
	var kJ = graph_size_alt;

	for(var i=1;  i <= kI;  i++) {
		coordsK1.push( [i, 1] );
	}
	
	for(var i=1;  i <= kJ;  i++) {
		coordsK2.push( [i, 2] );
	}

	var i;
	g = { nodes: [], edges: [] };

	for(i = 0; i < kI; i++) {
		g.nodes.push( {id: 'i' + i, label: labels[i], x: coordsK1[i][0], y: coordsK1[i][1], size: 20, color: colorArray[0] } );
	}
	for(i = 0; i < kJ; i++) {
		g.nodes.push( {id: 'j' + i, label: labels[kI+i], x: coordsK2[i][0], y: coordsK2[i][1], size: 20, color: colorArray[1] } );
	}
	
	var edge_cnt = 0;
	for(i = 0; i < kI; i++) {
		for(var j = 0; j < kJ; j++) {
			g.edges.push( {id: 'e' + edge_cnt, label: "1", source: 'i' + i, target: 'j' + j, size: 1, color: '#000'} );
			edge_cnt += 1;
		}
	}

	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

var q_label_counter = 0;

function drawQEdges(qN,top,a,b) {
	if(qN == 1) {
		g.edges.push( {id: 'e' + q_label_counter, label: "1", source: 'n' + a, target: 'n' + b, size: 1, color: '#000'} );
		q_label_counter += 1;
		return;
	} else {
		var uu = 0;
		for(var i = a; i <= Math.floor((a+b)/2); i++) {
			g.edges.push( {id: 'e' + q_label_counter, label: "1", source: 'n' + i, target: 'n' + (b-uu), size: 1, color: '#000'} );
			uu += 1;
			q_label_counter += 1;
		}
		drawQEdges(qN-1,top,a,Math.floor((a+b)/2));
		drawQEdges(qN-1,top,Math.ceil((a+b)/2),b);
	}
}

function drawQ() {
	var graph_size = parseInt(document.getElementById('graph_size').value);
	
	if(graph_size < 1) {
		alert("Q graph n must be greater than 0");
		return;
	} else if(graph_size > 10) {
		alert("Q graph n must be less than 11");
		return;
	}
	
	var coords = [0];
	var qN = graph_size;
	
	if(qN > 2) {
		var step = 2*Math.PI/(2**(qN-1));
		for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
			coords.push( [Math.cos(theta), Math.sin(theta)] );
		}
		
		var step = 2*Math.PI/(2**(qN-1));
		for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
			coords.push( [2*Math.cos(theta), 2*Math.sin(theta)] );
		}
	} else {
		var step = 2*Math.PI/(2**qN);
		for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
			coords.push( [Math.cos(theta), Math.sin(theta)] );
		}
	}

	var i;
	g = { nodes: [], edges: [] };

	for(i = 1; i <= 2**qN; i++) {
		if(i % 2 == 1) {
			g.nodes.push( {id: 'n' + i, label: labels[i-1], x: coords[i][0], y: coords[i][1], size: 20, color: colorArray[0] } );
		} else {
			g.nodes.push( {id: 'n' + i, label: labels[i-1], x: coords[i][0], y: coords[i][1], size: 20, color: colorArray[1] } );
		}
	}
	
	drawQEdges(qN,qN,1,2**qN);
	
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function drawA(is_import) {
	
	var coords = [];

	var i;
	if(!is_import) {
		g = { nodes: [], edges: [] };
	}

	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function addNode() {
	if(g.nodes.length > 100) {
		alert("You must have less than 100 nodes");
		return;
	}
	var i = 0;
	var node_label = "";
	if(g.nodes.length == 0) {
		node_label = labels[0];
		g.nodes.push( {id: 'n0', label: node_label, x: 0, y: 0, size: 20, color: colorArray[0] } );
	} else {
		var next_index = labels.indexOf(g.nodes[g.nodes.length - 1]['label']) + 1;
		g.nodes.push( {id: 'n' + next_index, label: labels[next_index], x: Math.random(), y: Math.random(), size: 20, color: colorArray[0] } );
	}
	
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function addEdge() {
	var source = $('#source_name')[0].value.toUpperCase();
	var target = $('#target_name')[0].value.toUpperCase();
	var weight = $('#edge_weight')[0].value;
	
	var source_id = "";
	var target_id = "";
	
	var i;
	for(i = 0; i < g.nodes.length; i++) {
		if(g.nodes[i]['label'] == source) {
			source_id = g.nodes[i]['id'];
		}
		if(g.nodes[i]['label'] == target) {
			target_id = g.nodes[i]['id'];
		}
	}
	
	if(source_id == "") {
		alert("Unable to locate source node.");
		return;
	} else if(target_id == "") {
		alert("Unable to locate target node.");
		return;
	} else if(isNaN(Number(weight)) || weight == "") {
		alert("Weight should be a number");
		return;
	}
	
	var is_parallel = false;
	var parallel_edge_i = 0;
	
	for(i = 0; i < g.edges.length; i++) {
		if( (g.edges[i]['source'] == source_id && g.edges[i]['target'] == target_id) || (g.edges[i]['target'] == source_id && g.edges[i]['source'] == target_id)) {
			is_parallel = true;
			if(source_id == target_id) {
				parallel_edge_i += 10;
			} else {
				parallel_edge_i += 20;
			}
		}
	}
	
	if(is_parallel) {
		g.edges.push( {id: 'e' + g.edges.length, label: weight, source: source_id, target: target_id, size: 4, color: '#000', count: parallel_edge_i, type: 'curve'} );
	} else if(source_id == target_id) {
		g.edges.push( {id: 'e' + g.edges.length, label: weight, source: source_id, target: target_id, size: 4, color: '#000', count: parallel_edge_i, type: 'curve'} );
	} else {
		g.edges.push( {id: 'e' + g.edges.length, label: weight, source: source_id, target: target_id, size: 4, color: '#000'} );
	}
	
	s.graph.clear();
	s.graph.read(g);
	s.refresh();
}

function primAnimation () { 
   setTimeout(function () {  
		var lowest = 9999999999;
		var lowest_id = "";
		var lowest_i;
		for(var i = 0; i < g.edges.length; i++) {
			if((visited_nodes.indexOf(g.edges[i]['source']) == -1 && visited_nodes.indexOf(g.edges[i]['target']) != -1) || (visited_nodes.indexOf(g.edges[i]['source']) != -1 && visited_nodes.indexOf(g.edges[i]['target']) == -1)) {
				if(Number(g.edges[i]['label']) < lowest) {
					if(visited_nodes.indexOf(g.edges[i]['source']) == -1) {
						lowest = g.edges[i]['label'];
						lowest_id = g.edges[i]['source'];
						lowest_i = i;
					} else {
						lowest = g.edges[i]['label'];
						lowest_id = g.edges[i]['target'];
						lowest_i = i;
					}
				}
			}
		}
		g.edges[lowest_i]['size'] = 4;
		g.edges[lowest_i]['color'] = '#F99500';
		
		for(var i = 0; i < g.nodes.length; i++) {
			if(g.nodes[i]['id'] == lowest_id) {
				prim_chain += ", " + g.nodes[i]['label'];
				break;
			}
		}
		$('#algo_path')[0].textContent = prim_chain;
		prim_weight += Number(g.edges[lowest_i]['label']);
		$('#algo_weight')[0].textContent = prim_weight;
		
		visited_nodes.push(lowest_id);
		unvisited_nodes.pop(unvisited_nodes.indexOf(lowest_id),1);
		s.graph.clear();
		s.graph.read(g);
		s.refresh();
		if (unvisited_nodes.length > 0) {
			primAnimation();    
		}
   }, 1000);
}
function kruskalAnimation () { 
   setTimeout(function () {  
		if(visited_nodes.indexOf(g.edges[kruskal_count]['source']) == -1 && visited_nodes.indexOf(g.edges[kruskal_count]['target']) == -1) {
			visited_nodes.push(g.edges[kruskal_count]['source']);
			visited_nodes.push(g.edges[kruskal_count]['target']);
			unvisited_nodes.pop(unvisited_nodes.indexOf(g.edges[kruskal_count]['source']),1);
			unvisited_nodes.pop(unvisited_nodes.indexOf(g.edges[kruskal_count]['target']),1);
			
			kruskal_chains.push([g.edges[kruskal_count]['source'],g.edges[kruskal_count]['target']]);
			
			g.edges[kruskal_count]['size'] = 4;
			g.edges[kruskal_count]['color'] = '#9C27B0';
			kruskal_weight += Number(g.edges[kruskal_count]['label']);
			kruskal_chain += nodeIDToNodeLabel(g.edges[kruskal_count]['source']) + "-" + nodeIDToNodeLabel(g.edges[kruskal_count]['target']) + ", ";
		} else if(visited_nodes.indexOf(g.edges[kruskal_count]['source']) == -1 && visited_nodes.indexOf(g.edges[kruskal_count]['target']) != -1) {
			visited_nodes.push(g.edges[kruskal_count]['source']);
			unvisited_nodes.pop(unvisited_nodes.indexOf(g.edges[kruskal_count]['source']),1);
			
			for(var i = 0; i < kruskal_chains.length; i++) {
				if(kruskal_chains[i].indexOf(g.edges[kruskal_count]['target']) != -1) {
					kruskal_chains[i].push(g.edges[kruskal_count]['source']);
					break;
				}
			}
			
			g.edges[kruskal_count]['size'] = 4;
			g.edges[kruskal_count]['color'] = '#9C27B0';
			kruskal_weight += Number(g.edges[kruskal_count]['label']);
			kruskal_chain += nodeIDToNodeLabel(g.edges[kruskal_count]['source']) + "-" + nodeIDToNodeLabel(g.edges[kruskal_count]['target']) + ", ";
		} else if(visited_nodes.indexOf(g.edges[kruskal_count]['source']) != -1 && visited_nodes.indexOf(g.edges[kruskal_count]['target']) == -1) {
			visited_nodes.push(g.edges[kruskal_count]['target']);
			unvisited_nodes.pop(unvisited_nodes.indexOf(g.edges[kruskal_count]['target']),1);
			
			for(var i = 0; i < kruskal_chains.length; i++) {
				if(kruskal_chains[i].indexOf(g.edges[kruskal_count]['source']) != -1) {
					kruskal_chains[i].push(g.edges[kruskal_count]['target']);
					break;
				}
			}
			
			g.edges[kruskal_count]['size'] = 4;
			g.edges[kruskal_count]['color'] = '#9C27B0';
			kruskal_weight += Number(g.edges[kruskal_count]['label']);
			kruskal_chain += nodeIDToNodeLabel(g.edges[kruskal_count]['source']) + "-" + nodeIDToNodeLabel(g.edges[kruskal_count]['target']) + ", ";
		} else {
			var kruskal_chains_i;
			var kruskal_chains_j;
			
			for(var i = 0; i < kruskal_chains.length; i++) {
				if(kruskal_chains[i].indexOf(g.edges[kruskal_count]['source']) != -1) {
					kruskal_chains_i = i;
				}
				if(kruskal_chains[i].indexOf(g.edges[kruskal_count]['target']) != -1) {
					kruskal_chains_j = i;
				}
			}
			
			if(kruskal_chains_i != kruskal_chains_j) {
				kruskal_chains[kruskal_chains_i] = kruskal_chains[kruskal_chains_i].concat(kruskal_chains[kruskal_chains_j]).unique();
				
				kruskal_chains.splice(kruskal_chains_j,1);
				
				g.edges[kruskal_count]['size'] = 4;
				g.edges[kruskal_count]['color'] = '#9C27B0';
				kruskal_weight += Number(g.edges[kruskal_count]['label']);
				kruskal_chain += nodeIDToNodeLabel(g.edges[kruskal_count]['source']) + "-" + nodeIDToNodeLabel(g.edges[kruskal_count]['target']) + ", ";
			}
		}
		$('#algo_path')[0].textContent = kruskal_chain;
		$('#algo_weight')[0].textContent = kruskal_weight;

		s.graph.clear();
		s.graph.read(g);
		s.refresh();
		
		kruskal_count += 1;
		if(kruskal_count == g.edges.length) {
			kruskal_chain = kruskal_chain.slice(0, -2);
			$('#algo_path')[0].textContent = kruskal_chain;
		}
		if (kruskal_count < g.edges.length) {
			kruskalAnimation();
		}
   }, 1000);
}
function finishDijkstra() {
	setTimeout(function () {  
		for( var i = 0; i < g.edges.length; i++) {
			if( (g.edges[i]['source'] == dijkstra_p1 && g.edges[i]['target'] == dijkstra_p2) || (g.edges[i]['target'] == dijkstra_p1 && g.edges[i]['source'] == dijkstra_p2) ) {
				g.edges[i]['size'] = 4;
				g.edges[i]['color'] = '#4CAF50';
				$('#algo_path')[0].textContent += nodeIDToNodeLabel(g.edges[i]['source']) + "-" + nodeIDToNodeLabel(g.edges[i]['target']) + ", ";
				$('#algo_weight')[0].textContent = Number($('#algo_weight')[0].textContent) + Number(g.edges[i]['label']);
			}
		}
		
		dijkstra_p1 = dijkstra_p2;
		dijkstra_p2 = g.nodes[nodeIDToNodeI(dijkstra_p1)]['annotated_previous'];

		s.graph.clear();
		s.graph.read(g);
		s.refresh();
		
		if(dijkstra_p2 != "") {
			finishDijkstra();
		} else {
			$('#algo_path')[0].textContent = $('#algo_path')[0].textContent.slice(0,-2);
		}
	}, 1000);
}

function dijkstraAnimation () { 
	var lowest = 999999999999;
	for(var i = 0; i < g.nodes.length; i++) {
		if(unvisited_nodes.indexOf(g.nodes[i]['id']) != -1) {
			if(g.nodes[i]['annotated_weight'] < lowest) {
				dijkstra_current = g.nodes[i]['id'];
				dijkstra_index = i;
				lowest = g.nodes[i]['annotated_weight'];
			}
		}
	}

	unvisited_nodes.splice(unvisited_nodes.indexOf(dijkstra_current),1);

	for(var i = 0; i < g.edges.length; i++) {
		if(g.edges[i]['source'] == dijkstra_current && unvisited_nodes.indexOf(g.edges[i]['target']) != -1) {
			if( g.nodes[dijkstra_index]['annotated_weight'] + Number(g.edges[i]['label']) < g.nodes[nodeIDToNodeI(g.edges[i]['target'])]['annotated_weight'] ) {
				g.nodes[nodeIDToNodeI(g.edges[i]['target'])]['annotated_weight'] = g.nodes[dijkstra_index]['annotated_weight'] + Number(g.edges[i]['label']);
				g.nodes[nodeIDToNodeI(g.edges[i]['target'])]['annotated_previous'] = g.edges[i]['source'];
			}
		} else if(g.edges[i]['target'] == dijkstra_current && unvisited_nodes.indexOf(g.edges[i]['source']) != -1) {
			if( g.nodes[dijkstra_index]['annotated_weight'] + Number(g.edges[i]['label']) < g.nodes[nodeIDToNodeI(g.edges[i]['source'])]['annotated_weight'] ) {
				g.nodes[nodeIDToNodeI(g.edges[i]['source'])]['annotated_weight'] = g.nodes[dijkstra_index]['annotated_weight'] + Number(g.edges[i]['label']);
				g.nodes[nodeIDToNodeI(g.edges[i]['source'])]['annotated_previous'] = g.edges[i]['target'];
			}
		}
	}
	
	if (unvisited_nodes.length > 0) {
		dijkstraAnimation();    
	} else {
		var dijkstra_last_node_index = nodeIDToNodeI($('#dijkstra_end_node :selected')[0].value);

		dijkstra_p1 = g.nodes[dijkstra_last_node_index]['id'];
		dijkstra_p2 = g.nodes[dijkstra_last_node_index]['annotated_previous'];
		finishDijkstra();
	}
}

var unvisited_nodes = [];
var visited_nodes = [];
var prim_chain = "";
var prim_weight = 0;
var kruskal_chains = [];
var kruskal_count = 0;
var kruskal_chain = "";
var kruskal_weight = 0;
var dijkstra_current = "";
var dijkstra_index = "";
var dijkstra_last_node_index = ""
var dijkstra_p1 = "";
var dijkstra_p2 = "";


function runPrim() {
	unvisited_nodes = [];
	visited_nodes = [];
	for(var i = 0; i < g.nodes.length; i++) {
		unvisited_nodes.push(g.nodes[i]['id']);
	}
	
	prim_chain = "";
	prim_weight = 0;
	
	var start_node = $('#prim_start_node :selected')[0].value;
	visited_nodes.push(start_node);
	unvisited_nodes.splice(unvisited_nodes.indexOf(start_node),1);
	
	prim_chain += $('#prim_start_node :selected')[0].text;
	
	$('#algo_path')[0].textContent = prim_chain;

	primAnimation();
}
function runKruskal() {
	unvisited_nodes = [];
	visited_nodes = [];
	kruskal_chains = [];
	kruskal_count = 0;
	kruskal_chain = "";
	kruskal_weight = 0;
	
	for(var i = 0; i < g.nodes.length; i++) {
		unvisited_nodes.push(g.nodes[i]['id']);
	}
	
	g.edges.sort(function(a, b) {
		return Number(a['label']) - Number(b['label']);
	});
	
	kruskalAnimation();
}
function runDijkstra() {
	unvisited_nodes = [];
	visited_nodes = [];
	
	var start_node = $('#dijkstra_start_node :selected')[0].value;
	var end_node = $('#dijkstra_end_node :selected')[0].value;
	
	for(var i = 0; i < g.nodes.length; i++) {
		unvisited_nodes.push(g.nodes[i]['id']);
		g.nodes[i]['annotated_weight'] = 9999999999999;
		g.nodes[i]['annotated_previous'] = "";
		if(g.nodes[i]['id'] == start_node) {
			g.nodes[i]['annotated_weight'] = 0;
			dijkstra_index = i;
		}
	}
	
	dijkstra_current = start_node;
	
	$('#algo_path')[0].textContent = "";
	$('#algo_weight')[0].textContent = "";
	
	if(start_node == end_node) {
		$('#algo_path')[0].textContent = "Start Node same as Target Node";
		$('#algo_weight')[0].textContent = 0;
	} else {
		dijkstraAnimation();
	}
}

drawC();
graphStatistics();

$('.custom').hide();

$(document).ready(function(){
    $(window).resize(function(){
        $("#graph_panel")[0].style.height = $(document).width()/2 + "px";
		if($(document).width() > 1199) {
			$($('#graph_setting_select')[0][0]).prop("selected",true);
			$( "#graph_setting_select" ).trigger( "change" );
		}
    });
});

$('#graph_setting_select').change(function () {
	switch($('#graph_setting_select :selected')[0].value) {
		case 'gt':
			$('#graph_type')[0].style.visibility = "";
			$('#graph_type')[0].style.height = "";
			$('#basic_info')[0].style.visibility = "hidden";
			$('#basic_info')[0].style.height = "0px";
			$('#graph_options')[0].style.visibility = "hidden";
			$('#graph_options')[0].style.height = "0px";
			break;
		case 'bi':
			$('#graph_type')[0].style.visibility = "hidden";
			$('#graph_type')[0].style.height = "0px";
			$('#basic_info')[0].style.visibility = "";
			$('#basic_info')[0].style.height = "";
			$('#graph_options')[0].style.visibility = "hidden";
			$('#graph_options')[0].style.height = "0px";
			break;
		case 'go':
			$('#graph_type')[0].style.visibility = "hidden";
			$('#graph_type')[0].style.height = "0px";
			$('#basic_info')[0].style.visibility = "hidden";
			$('#basic_info')[0].style.height = "0px";
			$('#graph_options')[0].style.visibility = "";
			$('#graph_options')[0].style.height = "";
			break;
	}
});

$("#graph_size").bind('keyup mouseup', function () {
	redrawGraph();
});
$("#graph_size_alt").bind('keyup mouseup', function () {
	redrawGraph();
});
$('input[type=radio][name=graphTypes]').change(function() {
	if(this.value.length == 1) {
		document.getElementById('graph_type_name').innerHTML = this.value.toUpperCase();
		document.getElementById('graph_type_index').innerHTML = 'n';
		document.getElementById('alt_num').style.visibility = "hidden";
	} else {
		document.getElementById('graph_type_name').innerHTML = this.value[0].toUpperCase();
		document.getElementById('graph_type_index').innerHTML = 'i';
		document.getElementById('alt_num').style.visibility = "";
	}
	if(this.value == 'a') {
		$('.non_custom').hide(1000);
		$('#source_name')[0].value = "";
		$('#target_name')[0].value = "";
		$('#edge_weight')[0].value = "";
		$('#custom_back')[0].style.visibility = "";
		$('#custom_back')[0].style.height = "";
		$('.custom').show(1000);
	} else {
		$('.non_custom').show();
		$('#custom_back')[0].style.visibility = "hidden";
		$('#custom_back')[0].style.height = "0px";
		$('.custom').hide();
	}
	redrawGraph();
});
$( "#custom_back_button" ).click(function() {
	$('.non_custom').show(1000);
	$('#custom_back')[0].style.visibility = "hidden";
	$('#custom_back')[0].style.height = "0px";
	$('.custom').hide(1000);
	$('#cGraph').click();
});
$( "#custom_add_node" ).click(function() {
	addNode();
	graphStatistics();
});
$( "#custom_add_edge" ).click(function() {
	addEdge();
	graphStatistics();
});
$('#algo_setup').click(function() {
	$('#prim_start_node').empty();
	$('#dijkstra_start_node').empty();
	$('#dijkstra_end_node').empty();
	
	$('#graph_panel')[0].style.height = "400px";
	$('.show_algo').show(1000);
	$('#algo_run_info')[0].style.visibility = "";
	$('#algo_run_info')[0].style.height = "";
	
	for(var i = 0; i < g.nodes.length; i++) {
		$('#prim_start_node').append($('<option>', {value:g.nodes[i]['id'], text:g.nodes[i]['label']}));
		$('#dijkstra_start_node').append($('<option>', {value:g.nodes[i]['id'], text:g.nodes[i]['label']}));
		$('#dijkstra_end_node').append($('<option>', {value:g.nodes[i]['id'], text:g.nodes[i]['label']}));
	}
});
$('#run_prim').click(function() {
	$('#prim_modal').modal('toggle');
	
	resetEdgeColors();
	
	if(!isComplexGraph()) {
		setTimeout(function () {
			var prim_results = runPrim();
		}, 1000);
	}
});
$('#run_kruskal').click(function() {
	$('#kruskal_modal').modal('toggle');
	
	resetEdgeColors();
	
	if(!isComplexGraph()) {
		setTimeout(function () {
			var kruskal_results = runKruskal();
		}, 1000);
	}
});
$('#run_dijkstra').click(function() {
	$('#dijkstra_modal').modal('toggle');
	
	resetEdgeColors();
	
	if(!isComplexGraph()) {
		setTimeout(function () {
			var dijkstra_results = runDijkstra();
		}, 1000);
	}
});
$( "#algo_hide_info" ).click(function() {
	$('.show_algo').hide(1000);
	$('#algo_run_info')[0].style.visibility = "hidden";
	$('#algo_run_info')[0].style.height = "0px";
	$('#graph_panel')[0].style.height = "460px";
	$('#algo_path')[0].textContent = "";
	$('#algo_weight')[0].textContent = "";
});
$('.importexport_button').click(function() {
	$('#export_data')[0].value = JSON.stringify(g);
	$('#import_data')[0].value = "";
});
