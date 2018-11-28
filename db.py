# -*- coding: utf-8 -*-import datetime

from flask import Flask, Blueprint

from sqlalchemy import create_engine, Column, Integer, String, ForeignKey,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
# 创建引擎
engine = create_engine("mysql+mysqlconnector://root:root@127.0.0.1:3306/my-weixin", echo=True)

# 创建基类
Base = declarative_base()

# 创建会话类
Session = sessionmaker(bind=engine)
session = Session()

bp = Blueprint("db", __name__)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    password = Column(String(16))
    address = Column(String(200))
    head_path = Column(String(200))
    books = relationship('Friend')


class Friend(Base):
    __tablename__ = "friend"
    id = Column(Integer, primary_key=True)
    friendname = Column(String(100))
    head_path = Column(String(100))
    friend_id = Column(Integer, ForeignKey('users.id'))

    def __repr__(self):
        return "<User(id={}, friendname={}, head_path={},friend_id={})>".format(self.id, self.friendname,
                                                                                self.head_path, self.head_path,
                                                                                self.friend_id)


class Circle_messages(Base):
    __tablename__ = "circle_messages"
    id = Column(Integer, primary_key=True)
    username = Column(String(100))
    head_path = Column(String(100))
    content =  Column(String(200))
    postedtime = Column(DateTime(timezone=True), server_default=func.now())
    liked = Column(String(10), default='false')
    show_comment = Column(String(10), default="false")
    def __repr__(self):
        return "<User(id={}, username={}, head_path={},content={})>".format(self.id, self.username,
                                                                                self.head_path, self.head_path,
                                                                                self.content)



class Comment(Base):
    __tablename__ = "comment"
    id = Column(Integer, primary_key=True)
    comment = Column(String(200))
    comment_name = Column(String(100))
    circle_messages_id = Column(Integer, ForeignKey('circle_messages.id'))
    pass


Base.metadata.create_all(engine)


# session.query()


@bp.route("/user")
def user_test():
    return "蓝图实验成功！"
