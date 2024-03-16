const mongodbCore = require('../mongodb/mongodb.js');
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const { generateId } = require('../utils/utils.js');

const getCurDate = () => dayjs().format('YYYY/MM/DD HH:mm:ss');

const shortLinkDb = {
  async getList(queryStr, { pageIndex, pageSize }, userId) {
    const db = mongodbCore.getDb();
    // 查询列表数据
    let queryRule = { userId };
    if (queryStr) {
      queryRule = {
        userId, // where userId='xxx' and ( shortLink like '%xx%' or xxx)
        $or: [{ shortLink: { $regex: queryStr } }, { redirect: { $regex: queryStr } }]
      };
    }
    // 页码 - skip数据量 - 公式
    // 1 0  (pageIndex - 1) * pageSize
    // 2 pageSize
    // 3
    const list = await db
      .collection('short-link')
      .find(queryRule)
      .limit(pageSize)
      .skip((pageIndex - 1) * pageSize)
      .toArray();

    const total = await db.collection('short-link').find(queryRule).count();
    return { list, total };
  },

  async add(payload, userId) {
    const db = mongodbCore.getDb();
    // 插入数据时 _id 会自动增加
    const insertResult = await db.collection('short-link').insertMany([
      {
        shortLink: payload.shortLink,
        redirect: payload.redirect,
        userId: userId,
        createDate: getCurDate()
      }
    ]);
    return insertResult;
  },

  async edit(payload) {
    const db = mongodbCore.getDb();
    const { shortLink, redirect, _id } = payload;
    const updateResult = await db.collection('short-link').updateOne(
      {
        _id: ObjectId(_id)
      },
      {
        $set: { shortLink, redirect, updateDate: getCurDate() }
      }
    );
    return updateResult;
  },

  async del(_id) {
    const db = mongodbCore.getDb();
    const deleteResult = await db.collection('short-link').deleteMany({
      _id: ObjectId(_id)
    });
    return deleteResult;
  }
};

const userBb = {
  async login({ name, password }) {
    const db = mongodbCore.getDb();
    const infoList = await db
      .collection('user')
      .find({
        name,
        password
      })
      .toArray();
    return { isValidUser: !!infoList.length, userInfo: infoList[0] };
  }
};

const configListDb = {
  // configList
  async getList(queryStr, { pageIndex, pageSize }, userId) {
    const db = mongodbCore.getDb();
    // 查询列表数据
    let queryRule = { userId };
    if (queryStr) {
      queryRule = {
        // userId, // where userId='xxx' and ( shortLink like '%xx%' or xxx)
        // $or: [{ shortLink: { $regex: queryStr } }, { redirect: { $regex: queryStr } }]
      };
    }
    // 页码 - skip数据量 - 公式
    // 1 0  (pageIndex - 1) * pageSize
    // 2 pageSize
    // 3
    const list = await db
      .collection('configList')
      .find(queryRule)
      .sort({ createDate: -1 })
      .limit(pageSize)
      .skip((pageIndex - 1) * pageSize)
      .toArray();

    const total = await db.collection('configList').find(queryRule).count();
    return { list, total };
  },

  async add(payload) {
    const db = mongodbCore.getDb();
    const { name, remark } = payload;
    const insertData = {
      name,
      remark,
      bid: generateId(),
      // userId: userId,
      // bid: payload.bid, // 配置ID
      // config: payload.config, // 低代码 schema 配置
      createDate: getCurDate()
    };
    // 插入数据时 _id 会自动增加
    const insertResult = await db.collection('configList').insertMany([insertData]);
    console.log('insertResult', insertResult);
    return { result: insertResult, insertData };
  },

  async update(payload) {
    const db = mongodbCore.getDb();
    const { bid, config } = payload;
    const result = await db.collection('configList').updateOne(
      { bid },
      {
        $set: { config, updateDate: getCurDate() }
      }
    );
    console.log('result', result);
    return { result: result };
  }
};
module.exports = {
  shortLinkDb,
  userBb,
  configListDb
};
