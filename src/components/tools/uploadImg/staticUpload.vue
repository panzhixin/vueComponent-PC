<template>
    <div class="static-upload">
        <div class="upload-file-container">
            <div class="upload-img-list" v-if="imgList.length > 0">
                <div
                    class="upload-img-item"
                    v-for="(item, index) in imgList"
                    :key="index"
                >
                    <img :src="item.url" alt="图片" />
                    <div class="upload-img-operate">
                        <i
                            class="el-icon-zoom-in upload-img-scale"
                            @click="scaleImg(index)"
                        ></i>
                        <i
                            class="el-icon-delete upload-img-delete"
                            @click="delImg(index)"
                        ></i>
                    </div>
                </div>
            </div>
            <div class="upload-img-container" v-show="isShowUpload">
                <i class="el-icon-plus upload-icon"></i>
                <input
                    type="file"
                    class="upload-file"
                    ref="selectFile"
                    @change="handleFileChange"
                />
            </div>
        </div>

        <el-dialog :visible.sync="imgDialogVisible" width="35%">
            <template slot="title">
                <p class="img-title">图片预览</p>
            </template>
            <div class="scale-img">
                <img :src="scaleImgSrc" alt="放大图片" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="imgDialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        length: {
            type: Number,
            default: 1,
        },
        sizeLimit: {
            type: Number,
            default: 5,
        },
        imgList: {
            type: Array,
            default: new Array(),
        },
    },
    data() {
        return {
            scaleImgSrc: "",
            imgDialogVisible: false,
            fileObj: {},
            fileName: "",
        };
    },
    computed: {
        isShowUpload() {
            return this.sizeLimit == this.imgList.length ? false : true;
        },
    },
    methods: {
        //检查上传的文件是否符合图片格式
        isPicCheck(fileName) {
            if (fileName != null && fileName != "") {
                //lastIndexOf如果没有搜索到则返回为-1
                if (fileName.lastIndexOf(".") != -1) {
                    var fileType = fileName
                        .substring(
                            fileName.lastIndexOf(".") + 1,
                            fileName.length
                        )
                        .toLowerCase();
                    var suppotFile = new Array();
                    suppotFile[0] = "jpg";
                    suppotFile[1] = "gif";
                    suppotFile[2] = "bmp";
                    suppotFile[3] = "png";
                    suppotFile[4] = "jpeg";
                    for (var i = 0; i < suppotFile.length; i++) {
                        if (suppotFile[i] == fileType) {
                            return true;
                        } else {
                            continue;
                        }
                    }
                    return false;
                } else {
                    return true;
                }
            }
        },
        // 对图片进行压缩
        compress(fileObj, callback) {
            if (typeof FileReader === "undefined") {
                console.log("当前浏览器内核不支持base64图标压缩");
                //调用上传方式不压缩
                this.directTurnIntoBase64(fileObj, callback);
            } else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    //要先确保图片完整获取到，这是个异步事件
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        let square = 0.4, //定义画布的大小，也就是图片压缩之后的像素
                            canvas = document.createElement("canvas"), //创建canvas元素
                            context = canvas.getContext("2d"),
                            imageWidth = Math.round(square * image.width), //压缩图片的大小
                            imageHeight = Math.round(square * image.height),
                            data = "";
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;
                        context.clearRect(0, 0, imageWidth, imageHeight); //在给定矩形内清空一个矩形
                        context.drawImage(this, 0, 0, imageWidth, imageHeight);
                        data = canvas.toDataURL("image/jpeg", 0.6);
                        //压缩完成执行回调
                        callback(data);
                    };
                };
                reader.readAsDataURL(fileObj);
            }
        },
        // 不对图片进行压缩，直接转成base64
        directTurnIntoBase64(fileObj, callback) {
            var r = new FileReader();
            // 转成base64
            r.onload = function () {
                //变成字符串
                imgBase64 = r.result;
                callback(imgBase64);
            };
            r.readAsDataURL(fileObj); //转成Base64格式
        },
        handleFileChange(e) {
            let _this = this;
            let inputDOM = this.$refs.selectFile;
            let file = inputDOM.files[0];
            if (file != null) {
                var format = _this.isPicCheck(file.name);
                var requiredLength = _this.length;
                var listLength = _this.imgList.length;
                var size = 1024 * 1024 * _this.sizeLimit; //图片最大容量,默认5M
                if (file.size > size) {
                    _this.$message({
                        type: "warning",
                        message: "您上传的图片容量过大，请重新上传！",
                    });
                    return false;
                }
                if (requiredLength == listLength) {
                    //上传的图片超出了限定的数量
                    _this.$message({
                        type: "warning",
                        message: "超出了限定的数量",
                    });
                    return false;
                }
                if (!format) {
                    //格式不合规
                    _this.$message({
                        type: "warning",
                        message: "请上传jpg、gif、bmp、png或jpeg的图片",
                    });
                    return false;
                } else {
                    _this.compress(file, function (imgBase64) {
                        let imgBase64str = imgBase64; //存储转换后的base64编码
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            _this.imgList.push({
                                url: imgBase64str,
                                name: file.name,
                            });
                            _this.$emit("getFile", _this.imgList);
                        };
                    });
                }
            }
        },
        scaleImg(index) {
            this.scaleImgSrc = this.imgList[index].url;
            this.imgDialogVisible = true;
        },
        delImg(index) {
            this.imgList.splice(index, 1);
            this.$refs.selectFile.value = "";
            this.$emit("getFile", this.imgList);
        },
    },
};
</script>

<style lang="less" scoped>
.static-upload {
    .img-title {
        font-size: 16px;
        text-align: center;
    }
    .upload-file-container {
        overflow: hidden;
    }

    .upload-img-container {
        float: left;
        position: relative;
        width: 148px;
        height: 148px;
        border: 1px dashed #ccc;
        background-color: #fbfdff;
        border-radius: 6px;
        cursor: pointer;

        input[type="file"] {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
        }

        .upload-icon {
            font-size: 28px;
            margin: 55px 60px;
            color: #8c939d;
        }
    }

    .upload-img-container:hover {
        border-color: #1890ff;
    }

    .upload-img-list {
        float: left;
        overflow: hidden;

        .upload-img-item {
            float: left;
            width: 148px;
            height: 148px;
            margin-right: 10px;
            border: 1px dashed #ccc;
            background-color: #fbfdff;
            border-radius: 6px;
            position: relative;
        }

        .upload-img-item > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
        }

        .upload-img-operate {
            position: absolute;
            width: 148px;
            height: 148px;
            left: 0;
            top: 0;
            text-align: center;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.5);
            font-size: 12px;
            line-height: 20px;
            color: white;
            z-index: 50;
            display: none;
        }

        i {
            font-size: 20px;
        }

        .upload-img-delete {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -10px;
            margin-left: 10px;
            cursor: pointer;
        }

        .upload-img-scale {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -10px;
            margin-left: -30px;
            cursor: pointer;
        }

        .upload-img-item:hover .upload-img-operate {
            display: block;
        }
    }
    .scale-img {
        width: 96%;
        margin: 0 auto;

        img {
            width: 100%;
        }
    }
}
</style>
