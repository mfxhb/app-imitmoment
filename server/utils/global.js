/*
 * @Author: BORING GHOST
 * @Date: 2022-08-02 14:51:35
 * @LastEditTime: 2022-08-10 17:22:46
 * @Description:
 */
module.exports = function (express) {
  express.Global = {
    // 判断是否为空
    isNull(data) {
      try {
        if (data === 0) return false;
        if (!data) return true;
        if ("{}" === JSON.stringify(data)) return true;
        if ("[]" === JSON.stringify(data)) return true;
      } catch (e) {
        return false;
      }
    },
    /**
     * 判断对象中是否有某些属性
     * @data 对象
     * @atrris 数组,想要包含的属性
     */
    isHaveAttri(data, atrris = []) {
      try {
        if (!(atrris instanceof Array)) return false;
        const keys = Object.keys(data);
        for (let k = 0, len = atrris.length; k < len; k++) {
          const item = atrris[k];
          if (!keys.includes(item)) return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    /**
     * 判断一个值是否为某一个类型,如果是这个类型,就返回原值,否则返回默认值
     * @value 原始值
     * @type string:想要的类型
     * @defaultV 默认值
     */
    isTypeTheValue(value, type, defaultV) {
      try {
        let result;
        switch (type) {
          case "String":
            result = typeof value === "string" ? value : defaultV;
            break;
          case "Number":
            result = typeof value === "number" ? value : defaultV;
            break;
          case "Array":
            // Fix :instanceof 不管用
            result = Array.isArray(value) ? value : defaultV;
            break;
          case "Object":
            result =
              Object.prototype.toString.call(value) === "[object Object]"
                ? value
                : defaultV;
            break;
        }
        return result;
      } catch (error) {
        console.log("判断错误:", error);
        return value;
      }
    },
  };
};
