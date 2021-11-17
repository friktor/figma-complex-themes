export const flattenDeep = <O = any[]>(arr: any): O =>
  arr.flatMap(subArray => (Array.isArray(subArray) ? flattenDeep(subArray) : subArray))
export const isPlainObject = obj => Object.prototype.toString.call(obj) === "[object Object]"
export const size = obj => (isPlainObject(obj) ? Object.keys(obj).length : obj.length)
export const last = arr => arr[arr.length - 1]

export function pick(object, keys): any {
  return keys.reduce((obj, key) => {
    if (object) {
      const value = object[key]

      if (value) {
        obj[key] = value
      }
    }
    return obj
  }, {})
}

export function omit(object, excludeKeys): any {
  return Object.keys(object).reduce((obj, key) => {
    if (object && !excludeKeys.includes(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

export function reduceObject(object, reducer, initialValue) {
  const keys = Object.keys(object)

  return keys.reduce((accumulator, key, currentIndex) => {
    const value = object[key]
    return reducer(accumulator, value, key, currentIndex)
  }, initialValue)
}

export function get(obj, path, defaultValue = undefined) {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

export function cloneDeep<T = any>(item: any): T {
  if (!item) {
    return item
  } // null, undefined values check

  const types = [Number, String, Boolean]
  let result

  // normalizing primitives if someone did new String('aaa'), or new Number('444')
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      result = []
      item.forEach(function (child, index, array) {
        result[index] = cloneDeep(child)
      })
    } else if (typeof item == "object") {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == "function") {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item)
        } else {
          // it is an object literal
          result = {}
          for (const i in item) {
            result[i] = cloneDeep(item[i])
          }
        }
      }
    } else {
      result = item
    }
  }

  return result
}
