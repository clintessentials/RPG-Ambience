// This file is part of RPG Ambience
// Copyright 2012-2013 Jakob Kallin
// License: GNU GPL (http://www.gnu.org/licenses/gpl-3.0.txt)

Ambience.App.Adventure.upgradeConfig = function(config) {
	config.version = Number(config.version);
	var originalVersion = config.version;
	while ( config.version < Ambience.App.Adventure.version ) {
		Ambience.App.Adventure.upgraders[config.version](config);
		config.version += + 1;
	}
	var upgradedVersion = config.version;
	console.log(
		'Upgraded adventure "' + config.title +
		'" from version ' + originalVersion +
		' to version ' + upgradedVersion
	);
};

Ambience.App.Adventure.upgraders = {
	1: function(config) {
		config.creationDate = new Date();
		delete config.media;
		
		config.scenes.forEach(function(scene) {
			scene.background = { color: scene.background };
			
			scene.fade = {
				direction: scene.fadeDirection,
				duration: Number(scene.fade)
			};
			delete scene.fadeDirection;
			
			delete scene.media;
			
			scene.image.file = {
				id: scene.image.id,
				name: scene.image.name
			};
			delete scene.image.id;
			delete scene.image.name;
			delete scene.image.path;
			
			scene.sound.tracks.forEach(function(track) {
				delete track.isPlayable;
				delete track.path;
			});
			scene.sound.volume = Number(scene.sound.volume);
			scene.sound.overlap = Number(scene.sound.crossover);
			delete scene.sound.crossover;
			
			scene.text.size = Number(scene.text.size);
			scene.text.padding = Number(scene.text.padding);
		});
	}
};