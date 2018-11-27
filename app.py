from flask import Flask, render_template, request, redirect, session, jsonify
from flask_socketio import SocketIO, emit, send
import json
import eventlet
import db

app = Flask(__name__)
app.secret_key = 'hello word'
app.register_blueprint(db.bp)

app.config["SECRET_KEY"] = 'hello super chat'
socketio = SocketIO(app)

messages = []


@app.route('/wuyanzu/')
def index():
    session["username"] = "吴彦祖"
    return render_template('wuyanzu.html')


# 注册
@app.route("/register/")
def register():
    return render_template("register.html")


# 注销
@app.route("/logout/")
def logout():
    session["username"] = None
    session["head_path"] = None
    return redirect("/")


# 登录后发送用户信息
@app.route("/getsession/", methods=["POST", "GET"])
def getseesion():
    print("实验一下", session["head_path"])
    return jsonify({"username":session["username"],"head_path":session["head_path"]})


@app.route("/chengeliked/", methods=["POST","GET"])
def chenge_liked():
    liked = request.get_json()

    print("点赞:",liked)
    return ""


@app.route('/indexs/')
def index1():
    if session["username"] != None and session["username"] != '':

        return render_template('huge.html')
    else:
        return redirect("/")


@app.route("/chat_friend/")
def chat_friend():
    pass


@app.route("/editadd/", methods=["POST","GET"])
def edit_add():
    editadd = request.get_json()
    edit = db.Circle_messages(username=editadd["username"], head_path=editadd["head_path"], content=editadd["comment"])
    db.session.add(edit)
    db.session.commit()
    print(edit)
    return jsonify({"status": "ok"})


# 获的评论
@app.route("/commentget/",methods=["POST","GET"])
def comment_get():
    comments = db.session.query(db.Comment).all()
    c = []
    for i in comments:
        d = {}
        d["id"] = i.id
        d["comment"] = i.comment
        d["comment_name"] = i.comment_name
        d["circle_messages_id"] = i.circle_messages_id
        c.append(d)

    print("发送评论是：", c)
    return jsonify(c)


#评论编辑
@app.route("/commentadd/", methods=["POST","GET"])
def comment_add():
    comment = request.get_json()
    print("评论:",comment)

    # 评论添加到数据库
    c = db.Comment(comment=comment["comment"], circle_messages_id = comment["id"], comment_name=comment["comment_name"])
    db.session.add(c)
    db.session.commit()



    s = {
        'status':200,
    }
    return jsonify(s)

# 朋友圈消息
@app.route("/circlemessages/", methods=["POST", "GET"])
def Circle_messages():
    circle_messages = db.session.query(db.Circle_messages).all()

    s = []
    for i in circle_messages:
        d = {}
        d["messageid"] = i.id
        d["username"] = i.username
        d["head_path"] = i.head_path
        d["content"] = i.content
        d["postedtime"] = i.postedtime
        d["liked"] = i.liked
        d["show_comment"] = i.show_comment
        s.append(d)
        s.reverse()

    print("发送的消息是：", s)
    return jsonify(s)


@app.route("/send/", methods=["POST", "GET"])
def test():
    friend = db.session.query(db.Friend).all()
    s = []
    for i in friend:
        d = {}
        d["id"] = i.id
        d["friendname"] = i.friendname
        d["head_path"] = i.head_path
        d["friend_id"] = i.friend_id
        s.append(d)
    print("接受的消息：", jsonify(s))
    return jsonify(s)


@app.route('/', methods=["POST", "GET"])
def login():
    if request.method == "GET":
        return render_template("demo.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")
        user = db.session.query(db.User).filter_by(username=username).first()
        if user.password == password:
            session['username'] = username
            session['head_path']= user.head_path
            if username == 'wuyanzu':
                return redirect("/wuyanzu/")
            else:
                return redirect("/indexs/")
        else:
            return render_template("404.html")
        # our_user = session.query(User).filter_by(name='ed').first()


@socketio.on('chat')
def chat(msg):
    msg['who'] = session["username"]
    print("发送内容：", msg)
    print("房间id", request.sid)
    messages.append(msg)
    emit('chat', msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
