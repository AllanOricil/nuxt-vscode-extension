const vscode = require('vscode');

module.exports = {
    BUTTONS_START_INDEX: 150,
	NUXT_DEFAULT_PORT_NUMBER: 3000,
	NUXT_PROJECT_URI: vscode.workspace.workspaceFolders[0].uri,
	NUXT_CONFIG_URI: vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "nuxt.config.js"),
	NUXT_DIRECTORIES: [ 'assets', 'components', 'layouts', 'middleware', 'modules', 'pages', 'plugins', 'static', 'store'],
	VUE_COMPONENT_SNIPPET: `<template>
</template>
	
<script>
export default {
	
}
</script>
	
<style scoped>
	
</style>`
};