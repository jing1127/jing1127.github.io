	//此处交互分别和两个后台人员交互，显示商家名称的是一个人，然后将输入的金额，以及支付是传给另一个人。
	//由于这个是APP项目，所以数字键盘必须在手机模拟器里面才能正常操作，请使用chrome手机模拟器。
	//点击添加留言按钮出来的模态框
		function texCheck(){
    		var modal1=document.getElementById("modal1");
    		modal1.style.display="block";
    	}
	//留言模态框里面的关闭按钮
    	function close1(){
    			 var modal1=document.getElementById("modal1");
    			 var liumore=document.getElementById("liumore");
    			 liumore.value="";
    			 modal1.style.display="none";
    	}
    //验证留言里面的字数不能超过十个字，超过后，确定按钮变色并且不能点击。
    	function qb(){
    		var liumore=document.getElementById("liumore");
    		var qb=document.getElementById("qb");
    		if(liumore.value.length>10){
    			qb.disabled=true;
			    qb.style.color="#333";
    		}else{
    			qb.disabled=false;
    			qb.style.color="#06BF04"
    		}
    	}
    //点击确定按钮之后，让留言内容显示到界面，将添加留言几个字改为修改。
    	function qbCheck(){
    		var modal1=document.getElementById("modal1");
    		var lius=document.getElementById("lius");
    		var liumore=document.getElementById("liumore");
    		var qbval=liumore.value;
    		var more=document.getElementById("more");
    		
    		lius.innerHTML=qbval;
    		modal1.style.display="none";
    		if(!lius.innerHTML==""){
    			more.innerHTML="修改";
    			
    		}else{
    			more.innerHTML="添加留言";
    		}
    		
    	}
    	//因为我做的是APP里面的页面，所以做任何交互之前，首先要获取用户的商户号，也就是用户的账号，区分是谁操作的。
    	//获取的方式是从地址栏获取，代码如下。
    	//获取地址栏
    	function UrlSearch()
			{
			    var name,value;
			    var str=location.href; //取得整个地址栏
			    var num=str.indexOf("?")
			    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
			    var arr=str.split("&"); //各个参数放到数组里
			    for(var i=0;i < arr.length;i++){
			        num=arr[i].indexOf("=");
			        if(num>0){
			            name=arr[i].substring(0,num);
			            value=arr[i].substr(num+1);
			            this[name]=value;
			        }
			    }
			}
			var Request=new UrlSearch(); //实例化，调用上面的函数。
			var merId=Request.merId;//获取商户号，merId为商户号的变量，若需要其它的变量，同样的写法。
			var liqType=Request.liqType;//获取支付类型，T0或T1.
			
			
			//console.log(Request.merId);
//			alert(merId);    
			//此处开始向后台传数据，在输入金额的横线上面一行，是有商家的名称的，这个名称来自于后台数据。
			//首先，我给后台传一个商户号，让他知道是谁付款。
			$.ajax({
				type:"post",
				url:"http://e.ifute.com/CMS/AppWhth/getMerName",
				data:{"merId":merId},//data里就是需要传的数据，merId为商户号。
				success:function(data){//success里面则是传成功之后后台返回的数据，返回的数据存在data里面。
					var manager;//声明存商家名称的变量名
					manager=data.merName;//merName是后台以这个变量名称将商家名称传给我。
					$("#who").html(manager);//#who是显示商家名称的html结构的ID
				},
          error:function(){
	          console.log("操作失败!");//传数据失败的提示，失败的原因很多，我写的步骤没错，但是后台接你变量的方式可能不对，或者是你们变量名没有对上，或者是跨域问题，我们公司不需要跨域。
					}
			})
			
			//此处为支付交互的地方，这个地方我用的表单提交，没有用ajax，不过也可以用，和上面方式一样。
			//由于我需要传的数据没有在input里面，而是在普通的dom元素里面，所以我将需要提交的数据，分别在结构里面写了隐藏域，在结构里面在注释。
			//然后将数据分别赋值给隐藏域，这样可以将数据直接以表单提交到后台了，表达的action则为后台给你的地址。
			//当然表达提交这种方式只适合于少量内容，如何数据多还是用ajax.
			$("#merId").val(merId);//将隐藏域的商户号赋值。
			$("#liqType").val(liqType);//将支付方式赋值。
			
			//因为我们这个做的是一个手机扫码支付之后的收银台页面，而且支付宝微信都可以用，也就是所谓的一码收款。
			//所以我需要判断用户用支付宝扫码还是微信扫码，然后将结果传到后台。
			
			//获取是微信还是支付宝扫码信息
    	var openType;//存扫码类型的变量
			//判断微信还是支付宝
			if(/MicroMessenger/.test(window.navigator.userAgent)){
				//微信
				openType='weixin';
			}else if(/AlipayClient/.test(window.navigator.userAgent)){
				//支付宝
				openType='zhifubao';
				
			}else{
				openType='others';
			}
			$("#openType").val(openType);//将扫码类型赋值到相应的隐藏域
			
			//由于要求金额必须保留两位小数，在用户没有输入两位小数的同时，下面函数为自动补齐两位小数。
			//设置金额为两位小数，自动补0；
			function toDecimal2(x){
			    var f = parseFloat(x);
			    if (isNaN(f)) {
			        return false;
			    }
			    var f = Math.round(x*100)/100;
			    var s = f.toString();
			    var rs = s.indexOf('.');
			    if (rs < 0) {
			        rs = s.length;
			        s += '.';
			    }
			    while (s.length <= rs + 2) {
			        s += '0';
			    }
			    return s;
			}
			//向后台传数据，判断金额格式，通过后点击确认按钮时触发此事件，并且将数据传给相应的后台。
	    function btnCheck(){
	    	var money=$('#number').html();//获取页面上金额
	    	var btn=$('#btn');//获取确认按钮
	    	//验证金额格式
	    	if(money==""){
	    		$(".modal").css("display","block");
	    		$("#error").html("金额不能为空！");
	    		return false;
	    	}else if(parseFloat(money)==0){
	    		$(".modal").css("display","block");
	    		$("#error").html("金额不能为0！");
	    		return false;
	    	}
	    	else{
	    		return true;
	    	}
    	}
    	$("#btn").click(function(){
    		
    		btnCheck();//调用函数
				    setTimeout(function(){
						$(".modal").css("display","none");
					},1600);//验证时提示模态框的定时器。
					//验证通过之后
				  if(btnCheck()){
				  	var money1=$("#number").html();//将输入的金额赋值给money1
				  	money=toDecimal2(money1);//将金额自动补0之后赋值给money 
				  	goodsbody=$("#lius").html();//将留言的内容赋值给goodsbody
						$("#money").val(money);//将金额赋值给隐藏域
						$("#goodsbody").val(goodsbody);//将留言内容赋值给隐藏域，这样可以提交到后台。
						form1.submit();//让表单提交
						$("#btn").attr("disabled","disabled");//点击确认按钮之后使按钮变为不可点，为了不让用户提交多次。
						$("#btn").css("color","#333");
		        $("#btn").css("background","#ccc");
		        $("#btn").css("border","#none");
				  }
    	})
