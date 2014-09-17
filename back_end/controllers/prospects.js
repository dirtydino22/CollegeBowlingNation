'use strict';

exports.newProspect = function(req, res) {
	var prospect = req.body;
	console.log('send mail', prospect);
  	return res.json(true);
};
