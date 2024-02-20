// Bill's AJAX layer
// [RV=]$AJ.doAJAX("/path/to/scropt/scropt"[,opts])
var $AJ = {
 init:function(){
   this.Actn = "";
   this.isActn = "";
   this.frm = "";
   this.ShowLoader=1;
   this.isComplete=0;
   this.Error="";
   this.ReturnData="";
   //this.ActnField = "#_FRMACTION";
   //this.subActnField = "#_FRM_SUB_ACTION";
   this.LoaderDelay = 1000;
 },	
 doAJAX:function(URL,OPTS){ // One Call to $.ajax ...
  var myData="",rv="",pType="POST",optValue="",OptName="",OptVal="",Opts="";
  var Actn=(this.Actn) ? this.Actn : "";
  var sActn=(this.isActn) ? this.isActn : ""; 
  
  this.isComplete=0;
  this.Error="";
  this.ReturnData="";
  
   if (OPTS){
    Opts = OPTS.split(/[,;&~\|]/ig);
	for (var i in Opts) {
	 optValue = Opts[i].split(/[=:]/ig);
	 OptName = optValue[0];
	 OptVal = optValue[1];
	 
	 if (/Delay/ig.test(OptName)) this.LoaderDelay = OptVal;
	 if (/Show/ig.test(OptName)) this.ShowLoader = OptVal;
	 
	}
   }
   
   if (URL) {
	  //if (Actn) jQuery(this.ActnField+"#_FACT, #frmAction, #_FACTN_, #fAction, .qqfActn").val(Actn);  // This Field needs to exist on a form & needs to be a controller on your Server side
	  //if (sActn) jQuery(this.subActnField).val(sActn);// This Field is optional, if it exists on a form  it needs to be a controller on your Server side. 
	  
	  if (this.frm) myData = jQuery(this.frm).serialize(); // Via Frm Id
	  else { // form must exist
	   $("form").each(function() {
	    myData += jQuery(this).serialize();
	   }); 
	  }	 
 
	  if (this.ShowLoader==1) this.SHOWLOADER();
	  
	  jQuery.ajax({
		type: pType,
		url: URL,
		data: myData,
		async: false,
		success: function(rVal) {
		 $AJ.ReturnData = rv = rVal;
		},
		error: function(xhr,err){
		 $AJ.Error=xhr+"\t"+err;
		 console.log("Error readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
		},
		complete:function(){
		 $AJ.isComplete=1; 
		 if (this.ShowLoader==1) $AJ.HIDELOADER();
		}			
	  });
	  
	  // Clear possible Form actions.
	  //if (Actn) jQuery(this.ActnField+"#_FRMACTION, #_FACT, #frmAction, #_FACTN_").val("");
	 // if (sActn) jQuery$(this.subActnField).val("");
  }	  
  this.Actn = this.isActn = this.frm = "";	    
  //if ( jQuery("#Loader").is(":visible") || this.ShowLoader==1 ) $AJ.HIDELOADER();
  //if (console.length && !/safari/ig.test(navigator.userAgent) ) console.clear();
  return rv;
 }, // end doajax 
 SetActn:function(iVal){
  this.Actn = (iVal) ? iVal : "";
 },
 SetisActn:function(iVal){
  this.isActn = (iVal) ? iVal : "";
 },
 SHOWLOADER:function(){
  //jQuery("#Loader").center().show();
 }, // end SHOWLOADER
 HIDELOADER:function(){
  //jQuery("#Loader").fadeOut(this.LoaderDelay);            
 } // end HIDELOADER
 
}; $AJ.init();