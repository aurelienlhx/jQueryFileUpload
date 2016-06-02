/**
 * jQueryFileUpload
 * @version 1.0.0
 * @author Aurélien Lheureux
 */

$.fn.file = function(user_options){
	var default_options = {
		url: "",//string | "form" which match the parent form
		params:{},
		dataType:"text",
		upload:function(){}
	}
	var options = $.extend({},default_options,user_options || {})
	return $(this).each(function(){
		var $this = $(this);
		$(this).bind("change",function(){
			var id = "f"+(Math.random()*(new Date().getTime())).toFixed(0);
			
			var $form = $("<form></form>") ;
			var url = options.url != "form" ? options.url : ($this.parents("form").attr("action"));
			$form.attr("action",url)
			.attr("enctype","multipart/form-data")
			.attr("target",id)
			.attr("method","post");
			$this.wrap($form);
			$form = $this.parent();
			
			for(var i in options.params)  
				$("<input type='hidden' name='"+i+"' value='"+options.params[i]+"' />").insertAfter($this);

			var $iframe = $("<iframe id='file-iframe' name='"+id+"' style='display:none'></iframe>");
			
			$iframe.load(function(){
				var content = $(this).contents().text();
				if(options.dataType.toLowerCase() == "json") {
					content = JSON.parse(content) || $.parseJSON(content);
				}
				$(this).remove();
				$form.children().not($this).remove();
				$this.unwrap();
				options.upload.call($this,content);
			})
			$("body").append($iframe);
			$form.submit();
		})
	})
}