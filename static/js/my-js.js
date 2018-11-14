 // 创建连接
 let socket = io("/");

 // 接受消息
 socket.on('chat', function (msg) {
     console.log('收到服务器消息', msg);
     app.messages.push(msg);
 });



 // vue
 let app;
 app = new Vue({
     el: "#app",
     data: {

         Circle_messages: null, // 朋友圈动态消息
         show_comments: [{
                 id: 1,
                 comment: "你好",
                 circle_messages_id: "1"
             },
             {
                 id: 2,
                 comment: "成功",
                 circle_messages_id: "2"
             },
             {
                 id: 3,
                 comment: "有一条",
                 circle_messages_id: "1"
             }
         ],
         friend: {}, //  好友列表
         username: '', // 当前登录用户
         chat_username: '', //  和谁聊天
         messages: [], // 存储聊天消息
         inputMessage: '', // 用户输入的消息
         seen: false, // 展示聊天窗口
         display_content1: false, // 展示朋友圈
         display_edit: false, // 展示添加动态框
         head_path: '../static/images/head/15.jpg',
     },
     methods: {

         //选择要聊天的好友
         chenge: function () {
             this.seen = true;
             this.display_content1 = false;
             this.chat_username = document.getElementById("1").innerHTML
         },


         // 展示聊天窗口
         display_content: function () {
             this.display_content1 = true;
             this.seen = false;
             this.display_edit = false;
             app.show_Circle_messages();
         },

         // 展示编辑动态页面
         show_display_edit: function () {
             this.display_content1 = false;
             this.display_edit = true;
             this.seen = false;
         },

         // 发送聊天内容
         send_messages: function () {
             if (this.inputMessage.trim() === '') {
                 alert('请输入内容');
                 return
             }
             let msg = {
                 who: this.username,
                 chat_username: this.chat_username,
                 cont: this.inputMessage
             };
             console.log(this.inputMessage);
             this.inputMessage = '';
             socket.emit('chat', msg)
         },

         // 修改点赞
         chenge_liked: function (i) {
             for (var n in this.Circle_messages) {
                 if (this.Circle_messages[n].messageid == i && this.Circle_messages[n].liked ==
                     "false") {
                     this.Circle_messages[n].liked = "true";
                 } else if (this.Circle_messages[n].messageid == i && this.Circle_messages[n].liked ==
                     "true") {
                     this.Circle_messages[n].liked = "false";
                 };
             };

             let xmlhttp = new XMLHttpRequest();
             xmlhttp.open("POST", "/chengeliked/", true);
             xmlhttp.setRequestHeader("Content-type", "application/json;charset:utf-8");
             xmlhttp.send(JSON.stringify({
                 id: i
             }));

             xmlhttp.onreadystatechange = () => {
                 if (xmlhttp.readyState === 4) {
                     if (xmlhttp.status === 200) {
                        //  alert("成功了!")
                     } else {
                         alert("出现异常" + xmlhttp.status)
                     }
                 }
             }
         },





         // 弹出评论框
         popup_comment: function (i) {
             for (var n in this.Circle_messages) {
                 if (this.Circle_messages[n].messageid == i && this.Circle_messages[n].show_comment ==
                     "false") {
                     this.Circle_messages[n].show_comment = "true";
                 } else if (this.Circle_messages[n].messageid == i && this.Circle_messages[n].show_comment ==
                     "true") {
                     this.Circle_messages[n].show_comment = "false"
                 }
             }
         },


         // 和服务器获得好友列表
         show_friend: function () {
             let xmlhttp = new XMLHttpRequest();


             xmlhttp.open("POST", "/send/", true);
             xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             var postData = {
                 domain: "xywy.com"
             }; //需要发送的数据 
             xmlhttp.send();

             xmlhttp.onreadystatechange = () => {
                 if (xmlhttp.readyState === 4) {
                     if (xmlhttp.status === 200) {
                         this.friend = JSON.parse(xmlhttp.responseText);
                     } else {
                         alert("出现异常" + xmlhttp.status)
                     }
                 }
             }
         },

         // 获得当前登录用户
         getusername: function () {
             let xmlhttp2 = new XMLHttpRequest();
             xmlhttp2.open("POST", "/getsession/", true)
             xmlhttp2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             xmlhttp2.send();
             xmlhttp2.onreadystatechange = () => {
                 if (xmlhttp2.readyState === 4) {
                     if (xmlhttp2.status === 200) {
                         this.username = JSON.parse(xmlhttp2.responseText).username;
                         this.head_path = JSON.parse(xmlhttp2.responseText).head_path;
                        //  alert("成功")
                     } else {
                         alert("出现异常" + xmlhttp2.status)
                     }
                 }
             }
         },



         // 动态消息获得
         show_Circle_messages: function () {
             let xmlhttp1 = new XMLHttpRequest();
             xmlhttp1.open("POST", "/circlemessages/", true);
             xmlhttp1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             var postData = {
                 domain: "xywy.com"
             }; //需要发送的数据 
             xmlhttp1.send();

             xmlhttp1.onreadystatechange = () => {
                 if (xmlhttp1.readyState === 4) {
                     if (xmlhttp1.status === 200) {
                         this.Circle_messages = JSON.parse(xmlhttp1.responseText);
                     } else {
                         alert("出现异常" + xmlhttp1.status)
                     }
                 }
             }
         },
         // 获得评论

         comment_get: function () {
             let xmlhttp = new XMLHttpRequest();
             xmlhttp.open("POST", "/commentget/", true);
             xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             xmlhttp.send();
             xmlhttp.onreadystatechange = () => {
                 if (xmlhttp.readyState === 4) {
                     if (xmlhttp.status === 200) {
                         this.show_comments = JSON.parse(xmlhttp.responseText);
                     } else {
                         alert("出现异常")
                     };
                 };
             };
         },

         //  添加评论
         comment_add: function (i) {
             let xmlhttp = new XMLHttpRequest();
             xmlhttp.open("POST", "/commentadd/", true);
             xmlhttp.setRequestHeader("Content-type", "application/json;charset:utf-8");
             let c = document.getElementById("comment_input").value;
             let postdata = {
                 comment: c,
                 id: i,
                 comment_name: this.username
             };
             xmlhttp.send(JSON.stringify(postdata));
             xmlhttp.onreadystatechange = () => {
                 if (xmlhttp.readyState === 4) {
                     if (xmlhttp.status === 200) {};
                 };
             };

             document.getElementById("comment_input").value = '';
             app.comment_get();
             for (var l in this.Circle_messages) {
                 if (this.Circle_messages[l].messageid == i) {
                     this.Circle_messages[l].show_comment = "false";
                 }
             }

         },


         // 添加动态
         edit_add: function () {
             let xmlhttp = new XMLHttpRequest();
             xmlhttp.open("POST", "/editadd/", true);
             xmlhttp.setRequestHeader("Content-type", "application/json;charset:utf-8");
             let edit_data = {
                 comment: document.getElementById("edit_add").value,
                 username: this.username,
                 head_path: this.head_path,
             };
             xmlhttp.send(JSON.stringify(edit_data));
             xmlhttp.onreadystatechange = () => {
                 if (xmlhttp.readyState === 4) {
                     if (xmlhttp.status === 200) {};
                 };
             };
             this.display_edit = false;
         },
     }
 });