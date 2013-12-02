var LoadManager = function(){
	this.templateData = {};
	this.loadHTML = function(fileName,templateData,completion) {
		var self = this;
		var testObj = this.templateData;
		if (fileName in testObj) {
			this.renderHTML(this.templateData[fileName],templateData,completion);
			return;
		}
		$.get('views/' + fileName, function(data) {
			self.templateData[fileName] = data;
			self.renderHTML(data,templateData,completion);
		});
	},
	this.renderHTML = function(data,templateData,completion) {
		completion(Mustache.render(data,templateData));
	}
}