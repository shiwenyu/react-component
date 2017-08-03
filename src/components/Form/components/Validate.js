/**
 * Created by Aus on 2017/8/2.
 */
// 常规的验证方法 根据给定的数据来验证
// 支持的验证类型有：必填 长度 数值 自定义
// Validate([
//     {name: '', value: '', require: true}, // 必填验证
//     {name: '', value: '', require: true, errorText: ''}, // 自定义报错文案
//     {name: '', value: '', min: '', max: ''}, // 长度验证
//     {name: '', value: '', type: 'number', min: '', max: ''}, // 数值验证
//     {name: '', value: '', type: 'email'}, // 邮箱验证
//     {name: '', value: '', type: 'phone'}, // 手机验证
//     {name: '', value: '', customVerify: (name, value)=>{}}, // 自定义验证方式
// ]);
//  验证会将输入的值全部验证

// 准备输出结果
let result = [];

const Validate = (validateArray) => {
    // 验证validateArray
    if(!validateArray || !(validateArray instanceof Array)) return;

    result = [];
    // 策略模式
    for(let item of validateArray){
        const {id, name, value, require, type, customVerify, errorText, max, min} = item;
        let validateErrorText = '';

        // 1.最高优先级：自定义验证规则
        if(customVerify){
            const customVerifyResult = customVerify(name, value);

            // 自定义验证规则的结果：true / 报错文案
            if(customVerifyResult !== true){
                // 有报错
                const errorItem = {status: false, name: name, error: customVerifyResult};

                if(id) errorItem.id = id;

                result.push(errorItem);
                continue;
            }
        }

        // 2.验证required
        if(require){
            if(!(value && value.length > 0)){
                validateErrorText = name + "不能为空!";

                updateErrorInResult(id, validateErrorText, errorText);
                continue;
            }
        }

        // 3.根据不同type验证
        if(!type){
            let pass = false;

            // 没有type 长度验证
            if(min && !max && typeof min === 'number'){
                // 只有最小
                if(value.length < min){
                    validateErrorText = name + "长度不能少于" + min;

                    updateErrorInResult(id, validateErrorText, errorText);

                }
                // 验证通过
                pass = true;
            } else if (max && !min && typeof max === 'number') {
                // 只有最大
                if(max < value.length){
                    validateErrorText = name + "长度不能超过" + max;

                    updateErrorInResult(id, validateErrorText, errorText);
                }
                pass = true;
            } else if (max && min && typeof max === 'number' && typeof min === 'number') {
                if(value.length < min || value.length > max){
                    validateErrorText = name + "长度应在" + min + "~" + max + "之间";

                    updateErrorInResult(id, validateErrorText, errorText);
                }
                pass = true;
            }

            if(!pass) continue;
        }

        // 4.type
        switch (type) {
            case 'email':
                // 正则验证
                if(!/[\w-\.]+@([\w-]+\.)+[a-z]{2,3}/.test(value)){
                    validateErrorText = name + '格式不正确！';
                    updateErrorInResult(id, validateErrorText, errorText);
                }
                break;
            case 'phone':
                if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){
                    validateErrorText = name + '格式不正确！';
                    updateErrorInResult(id, validateErrorText, errorText);
                }
                break;
            case 'number':
                // 数值
                // 没有type 长度验证
                if(min && !max && typeof min === 'number'){
                    // 只有最小
                    if(value < min){
                        validateErrorText = name + "不能少于" + min;

                        updateErrorInResult(id, validateErrorText, errorText);

                    }
                } else if (max && !min && typeof max === 'number') {
                    // 只有最大
                    if(max < value){
                        validateErrorText = name + "不能超过" + max;

                        updateErrorInResult(id, validateErrorText, errorText);
                    }
                } else if (max && min && typeof max === 'number' && typeof min === 'number') {
                    if(value < min || value > max){
                        validateErrorText = name + "应在" + min + "~" + max + "之间";

                        updateErrorInResult(id, validateErrorText, errorText);
                    }
                }
                break;
        }
    }

    return result;
};

const updateErrorInResult = (id, validateErrorText, errorText) => {

    if(errorText) validateErrorText = errorText;

    const errorItem = {error: validateErrorText};

    if(id) errorItem.id = id;

    result.push(errorItem);
};

export default Validate;