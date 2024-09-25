var data_france = {}; // les données rassemblées pour la france entière de 2011 à 2022

var data_dep_2022 = {}; // les données pour chaque département en 2022

var data_reg_2022 = {}; // les donées pour chaque région en 2022


// fonction appelée au chargement de fichier de données
var indicateur = function() {
	
	// construction de data_france
    for (var i = 2011; i <= 2022; i++) {
        data_france[i] = {};

        for (j = 5; j <=16; j++) {
            data_france[i][header[j]] = 0;
        }
    }

    for (var i = 0; i < data.length-1; i++) {
        year = data[i]["annee"];
        for (j = 5; j <=16; j++) {
            data_france[year][header[j]] += Number(data[i][header[j]]);
        }

    }


	// construction de data_dep_2022
    for (var i = 0; i < data.length-1; i++) {
        if (data[i]["annee"] == 2022) {
            var dep = data[i]["nom_departement"];
            data_dep_2022[dep] = {};
            data_dep_2022[dep]["code_departement"] = data[i]["code_departement"];
            for (j = 5; j <=16; j++) {
                data_dep_2022[dep][header[j]] = Number(data[i][header[j]]);
            }
            for (j = 17; j <=18; j++) {
                data_dep_2022[dep][header[j]] = data[i][header[j]];
            }
        }
    }
    
    // construction de data_reg_2022
    for (var i = 0; i < data.length-1; i++) {
        if (data[i]["annee"] == 2022) {
            var reg = data[i]["nom_region"];
            if (reg in Object.keys(data_reg_2022)){
                for (j = 5; j <=16; j++) {
                    data_reg_2022[reg][header[j]] += Number(data[i][header[j]]);
                }
            }
            else {
                data_reg_2022[reg] = {};
                data_reg_2022[reg]["code_region"] = data[i]["code_region"];
                for (j = 5; j <=16; j++) {
                    data_reg_2022[reg][header[j]] = Number(data[i][header[j]]);
                }
            }

        }
    }

	// affichage des indicateurs
    creation_top_dep();
    creation_barre();
    afficheCourbes();
    afficheVariations();
	creation_carte();

	// mise en place d'un filtre sur 2 indicateurs
    var valider = document.getElementById("valider");
    valider.addEventListener("click", creation_barre);
    valider.addEventListener("click", creation_top_dep);
}


// affiche les variations de quantité d'énergie produite d'origine Eolienne et hydraulique entre 2011 et 2022
var afficheVariations = function() {

	let energieEolienne2011;
	let energieEolienne2022;
	let variationEolien;

	let energieHydraulique2011;
	let energieHydraulique2022;
	let variationHydraulique;
	
	
	// variation de l'éolien 
	energieEolienne2011 = data_france[2011]["energie_produite_annuelle_eolien_enedis_mwh"];
	energieEolienne2022 = data_france[2022]["energie_produite_annuelle_eolien_enedis_mwh"];
	
	variationEolien = ((energieEolienne2022 - energieEolienne2011)/(energieEolienne2011))*100; 
	 
	 
	 // variation de l'hydraulique
	energieHydraulique2011 = data_france[2011]["energie_produite_annuelle_hydraulique_enedis_mwh"];
	energieHydraulique2022 =  data_france[2022]["energie_produite_annuelle_hydraulique_enedis_mwh"];
	
	variationHydraulique = ((energieHydraulique2022 - energieHydraulique2011)/(energieHydraulique2011))*100;
	
	
	// affichage avec Plotly
	let dataEolien = [{
		type: "indicator",
		mode : "delta",
		value : variationEolien,
		delta : {reference: 0} }
	];
		
	let layoutEolien = {
		width:400,
		height:220,
		template : {
			data : {
				indicator : [
					{
						title: { 
							text: "Energie éolienne produite (en %)" ,
							font: {size : 16}
						},
						mode: "number+delta+gauge",
					}
				]
			}
		}
	};
	
	let dataHydraulique = [{
		type: "indicator",
		mode : "delta",
		value : variationHydraulique,
		delta : {reference: 0} }
	];
		
	let layoutHydraulique = {
		width:400,
		height:220,
		template : {
			data : {
				indicator : [
					{
						title: { 
							text: "Energie Hydraulique produite (en %)" ,
							font: {size : 16}
						},
						mode: "number+delta+gauge",
					}
				]
			}
		}
	};
	
	let variation1 = document.getElementById('var1');
	let variation2 = document.getElementById('var2');
	Plotly.newPlot(variation1,dataEolien,layoutEolien);
	Plotly.newPlot(variation2,dataHydraulique,layoutHydraulique);
	
}


// affichage d'un graphique en zones empilées de la production électrique en France des différentes filières entre 2011 et 2022.
var afficheCourbes = function(){

	let annee = [];
	let photoVProduite = [];
	let eolienProduite = [];
	let hydrauliqueProduite = [];
	let bioEProduite = [];
	let cogenerationProduite = [];
	
	let i;
	
	// récupération des données nécessaires dans des listes.
	for (i=0;i<=11;i++){
		annee[i] = 2011+i;
		photoVProduite[i] = data_france[2011+i]["energie_produite_annuelle_photovoltaique_enedis_mwh"];	
		eolienProduite[i] = data_france[2011+i]["energie_produite_annuelle_eolien_enedis_mwh"];	
		hydrauliqueProduite[i] = data_france[2011+i]["energie_produite_annuelle_hydraulique_enedis_mwh"];	
		bioEProduite[i] = data_france[2011+i]["energie_produite_annuelle_bio_energie_enedis_mwh"];	
		cogenerationProduite[i] = data_france[2011+i]["energie_produite_annuelle_cogeneration_enedis_mwh"];	
	}
	
	
	// affichage du graphique avec Plotly
	divCourbes = document.getElementById('courbes');
	
	let courbes = [
		{
			x: annee,
		 	y: photoVProduite, 
		 	stackgroup: 'one',
		 	name: 'photovoltaique'
		 },
		 {
			x: annee,
		 	y: eolienProduite, 
		 	stackgroup: 'one',
		 	name: 'eolien'
		 },
		 {
			x: annee,
		 	y: hydrauliqueProduite, 
		 	stackgroup: 'one',
		 	name: 'hydraulique'
		 },
		 {
			x: annee,
		 	y: bioEProduite, 
		 	stackgroup: 'one',
		 	name: 'bio-energie'
		 },
		 {
			x: annee,
		 	y: cogenerationProduite, 
		 	stackgroup: 'one',
		 	name: 'cogeneration'
		 }	
	];
	
	let layout = {
		title : {
			text: "Evolution de la quantité d'energie produite sur toute la France",
			font: {size : 13}
		}
	};
	
	Plotly.newPlot(divCourbes,courbes,layout);
}


// affichage des 3 départements qui produisent le plus d'énergie en 2022 pour une filière donnée
var creation_top_dep = function() {
	// récupération du type d'énergie sélectionnée dans la liste déroulante
     var selection = document.getElementById("selection");
    var type = selection.value;


    var top_dep = []; // liste des départements et de la quantité d'énergie produite

	// construction de top_dep
    for(var [dep, value] of Object.entries(data_dep_2022)) {
        top_dep.push([dep, value["energie_produite_annuelle_" + type + "_enedis_mwh"]]);
    }

	// trie par ordre décroissant de quantité d'énergie produite
    top_dep.sort(function(a,b) { return b[1] - a[1]});

	// affichage des 3 premiers départements
    var classement = document.getElementById("classement");

    var string = "<div><h5>" + "les départements produisant le plus d'energie de type "+type + " en 2022 : " + "</h5> <ol>";
    for (var i = 0; i < 3; i++) {
        string = string + "<li>" + top_dep[i][0] + " : " + top_dep[i][1] + "MWh" + "</li>";
    }
    string = string + "</ol></div>";

    classement.innerHTML = string;

}


// affichage du diagramme en barre de la quantité d'énergie produite par région en 2022 pour une filière 
var creation_barre = function () {
	// récupération du type d'énergie sélectionnée dans la liste déroulante
    var selection = document.getElementById("selection");
    var type = selection.value;

    x = Object.keys(data_reg_2022); // la liste des régions
	
    y = []; // la liste des quantités d'énergies produites
    for (var reg of x) {
        y.push(data_reg_2022[reg]["energie_produite_annuelle_" + type + "_enedis_mwh"])
    }

	// affichage du diagramme avec Plotly
    var d = [{
        x : x,
        y : y,
        type : 'bar'
    }];

    var layout = {
        title: {
        	text: 'Production électrique par ' + type + ' par régions en 2022',
        	font : {size:13}
        },
        yaxis: {title: 'MWh'},
        xaxis: {title: 'régions'},
        width: 450,
	height: 600
    };

    var diagramme = document.getElementById("barres");

    Plotly.newPlot(diagramme, d, layout);
}


// affichage de la carte de france représentant le nombre de site de production éolien par département
var creation_carte = function() {
	
	// mise en place de la carte avec Leaflet
	const map = L.map('map', {
	  center: [47, 1],
	  zoom: 5.2
	});
	
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
	
	

    var type = "eolien";
	
	
	// extraction des données nécessaires
	var S = 0;
	for ( dep of Object.keys(data_dep_2022)) {
		S += data_dep_2022[dep]["nb_sites_" + type + "_enedis"];
	}
	
	for ( dep of Object.keys(data_dep_2022)) {
		var taille = data_dep_2022[dep]["nb_sites_" + type + "_enedis"];
		var coor = data_dep_2022[dep]["geo_point_2d\r"].split(";");
		
		// mise en place des marqueurs
		var cercle = L.circle([Number(coor[0]),Number(coor[1])], {radius: 500000*taille/S, color: 'orange'});
		cercle.bindTooltip(dep + ": " + taille + " sites");
		cercle.addTo(map);
	}
	
	
	// affichage de la légende
	var legende = document.createElement("div");
	legende.innerHTML = "<h5>Nombres de sites de production éolien par département en 2022</h5>";
	
	var carte = document.getElementById("carte");
	carte.insertBefore(legende, carte.lastChild);
	
	
}