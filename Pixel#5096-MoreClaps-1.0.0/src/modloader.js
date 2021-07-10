exports.mod = (mod_data) => 
{
    logger.logInfo(`[MOD] ${mod_data.name}`);
	// we gonna edit cache files in order to add everything - we also not gonna use lateLoaded flag so thsi script will be loaded just after cache is created

	//disclaimer: a file name should be an "_id" of an item from items.json

	// get data from mod.config.json
	let ModFolderName = `${mod_data.author}-${mod_data.name}-${mod_data.version}`;
	let ModFolders = mod_data.folders;
	let ModFileNames = mod_data.filenames;
	let PathResolver = global.internal.path.resolve;

	// load cache files we need
	let items = global.fileIO.readParsed(PathResolver('user/cache/items.json'));
	let assort_ragfair = global.fileIO.readParsed(PathResolver('user/cache/assort_ragfair.json'));
	let locale_en = global.fileIO.readParsed(PathResolver('user/cache/locale_en.json'));
	let templates = global.fileIO.readParsed(PathResolver('user/cache/templates.json'));
	let readDB = global.fileIO.readParsed(PathResolver('user/cache/db.json'));

	//we gonna store temporal data here;
	let tDataBase = {};

	// you can replace it with reading folder names and file names from directories should be easier to maintain then we will not need folders and filenames made by hand
	// to read all files/folders in specified directory use global.json.readDir(path)
	// a PathResolver should fix the wrong pathing problem :) aka file not found thing
	for (let folder of ModFolders) {
		tDataBase[folder] = {};
		for (let file of ModFileNames) {
			let fileData = global.fileIO.readParsed(PathResolver(`user/mods/${ModFolderName}/${folder}/${file}.json`));

			tDataBase[folder][file] = fileData;
		}
	}
	// process presets
	// var globalsFilePath = PathResolver(`user/mods/${ModFolderName}/files/globals.json`);
	// readDB.cacheBase.globals = globalsFilePath;
	// process "files/assort/ragfair"
	for (let item in tDataBase["files/assort/ragfair"]) {
		let itemData = tDataBase["files/assort/ragfair"][item];
		let pricingData = tDataBase["files/templates"][item].Price;
		assort_ragfair.data.items.push(itemData);
		assort_ragfair.data.barter_scheme[itemData._id] = [[{ "count": pricingData, "_tpl": "5449016a4bdc2d6f028b456f" }]];
		assort_ragfair.data.loyal_level_items[itemData._id] = 1;
	}
	// process "files/items"
	for (let item in tDataBase["files/items"]) {
		let itemData = tDataBase["files/items"][item];
		items.data[item] = itemData;
	}
	// process "files/locales/en"
	for (let item in tDataBase["files/locales/en"]) {
		let itemData = tDataBase["files/locales/en"][item];
		locale_en.templates[item] = itemData;
	}
	// process "files/templates"
	for (let item in tDataBase["files/templates"]) {
		templates.data.Items.push(tDataBase["files/templates"][item]);
	}

	//Save Processed data to back to files with compression enabled
	// json.write(filename, data, shouldBeCompressed?);
	fileIO.write(PathResolver('user/cache/items.json'), items, true);
	fileIO.write(PathResolver('user/cache/assort_ragfair.json'), assort_ragfair, true);
	fileIO.write(PathResolver('user/cache/locale_en.json'), locale_en, true);
	fileIO.write(PathResolver('user/cache/templates.json'), templates, true);

    logger.logSuccess(`[MOD] ${mod_data.name}; Applied`);
}