<template>
  <div class="wrap">
    <el-card class="box-card">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="search.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="search.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getGoodsList" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insert">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="h20"></div>
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" prop="ProductID" label="商品id"></el-table-column>
        <el-table-column align="center" prop="InternalName" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="InternalEnglishName" label="商品英文名称"></el-table-column>
        <el-table-column align="center" prop="InternalEnglishName" label="商品公共suk"></el-table-column>
        <el-table-column align="center" prop="JD_Sku" label="京东sku"></el-table-column>
        <el-table-column align="center" prop="TM_Sku" label="天猫sku"></el-table-column>
        <el-table-column align="center" prop="SN_Sku" label="苏宁sku"></el-table-column>
        <el-table-column align="center" prop="IsMultiple" label="是否关联"></el-table-column>
        <el-table-column align="center" prop="JoinProductID" label="关联商品"></el-table-column>
        <el-table-column align="center" prop="JoinProductSum" label="关联数量"></el-table-column>
      </el-table>
      <pagination
        v-show="pageCount > 0"
        :total="pageCount"
        :page.sync="pageNumber"
        :limit.sync="pageSize"
        @pagination="getGoodsList"
      />
    </el-card>
    <el-dialog title="商品信息" width="500px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="form.InternalName"></el-input>
        </el-form-item>
        <el-form-item label="商品英文名">
          <el-input v-model="form.InternalEnglishName"></el-input>
        </el-form-item>
        <el-form-item label="公共sku">
          <el-input v-model="form.Sku"></el-input>
        </el-form-item>
        <el-form-item label="京东sku">
          <el-input v-model="form.JD_Sku"></el-input>
        </el-form-item>
        <el-form-item label="天猫sku">
          <el-input v-model="form.TM_Sku"></el-input>
        </el-form-item>
        <el-form-item label="苏宁sku">
          <el-input v-model="form.SN_Sku"></el-input>
        </el-form-item>
        <el-form-item label="是否关联">
          <el-switch v-model="form.IsMultiple"></el-switch>
        </el-form-item>
        <el-form-item label="关联商品id">
          <el-select v-model="form.JoinProductID" placeholder="请选择商品">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品数量">
          <el-input v-model="form.JoinProductSum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGoods">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import { addGoods, editGoods, delGoods, getGoodsList } from "@/api/goods";
import { async } from 'q';
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      dialogFormVisible: false,
      pageSize: 10,
      pageNumber: 1,
      pageCount: 1,
      form: {},
      search: {},
      tableData: []
    };
  },
  methods: {
    async insert() {
      var data = [
{"Sku":"8885006033106","Img":"","InternalName":"儿童益菌宝","InternalEnglishName":"Powerbiotics Kids 60 tablets","JD_Sku":"29496980151","TM_Sku":"Powerbiotics Kids","SN_Sku":"0","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"1","Img":"","InternalName":"天然纯正即食燕窝","InternalEnglishName":"Vitarealm Premium Birds Nest 5 bottles*226g","JD_Sku":"32506774739","TM_Sku":"Birds Nest 5 bottles","SN_Sku":"1","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006033588","Img":"","InternalName":"天然纯正即食燕窝","InternalEnglishName":"Vitarealm Premium Birds Nest 6 bottles*226g","JD_Sku":"1","TM_Sku":"Birds Nest","SN_Sku":"2","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"抗糖化胶原蛋白饮","InternalEnglishName":"Vitarealm Anti-A.G.E Essence 8 bottles","JD_Sku":"0","TM_Sku":"Anti-A.G.E Essence","SN_Sku":"3","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"保湿胶原蛋白果冻","InternalEnglishName":"VitaRealm Anti-glycation Collagen Jelly  15 piece","JD_Sku":"1969366494","TM_Sku":"Anti-glycation Collagen Jelly","SN_Sku":"4","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006033625","Img":"","InternalName":"修复胶原蛋白果冻","InternalEnglishName":"VitaRealm Skin perfecting Collagen Jelly 15 piece","JD_Sku":"1981442272","TM_Sku":"Skin perfecting Collagen Jelly","SN_Sku":"5","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 16:37"},
{"Sku":"8885006033632","Img":"","InternalName":"抗糖化胶原蛋白果冻","InternalEnglishName":"VitaRealm Anti-A.G.E Collagen Jelly 15 piece","JD_Sku":"1969333219","TM_Sku":"Anti-A.G.E Collagen Jelly","SN_Sku":"6","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 17:37"},
{"Sku":"1","Img":"","InternalName":"蜂胶","InternalEnglishName":"VitaRealm Hyper strength propolis","JD_Sku":"1","TM_Sku":"Hyper strength propolis","SN_Sku":"7","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 18:37"},
{"Sku":"8885006031256","Img":"","InternalName":"亮眼康","InternalEnglishName":"VitaRealm PowerEye 60 capsules","JD_Sku":"1981552696","TM_Sku":"PowerEye","SN_Sku":"8","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 19:37"},
{"Sku":"0","Img":"","InternalName":"美白胶原蛋白果冻","InternalEnglishName":"VitaRealm Whitening Collagen Jelly 15 piece","JD_Sku":"1969332029","TM_Sku":"Whitening Collagen Jelly","SN_Sku":"9","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 20:37"},
{"Sku":"0","Img":"","InternalName":"泌尿康","InternalEnglishName":"VitaRealm PowerBladder 60 capsules","JD_Sku":"1981566992","TM_Sku":"PowerBladder","SN_Sku":"10","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 21:37"},
{"Sku":"0","Img":"","InternalName":"心血康","InternalEnglishName":"VitaRealm PowerHeart 80 capsules","JD_Sku":"1981566628","TM_Sku":"PowerHeart","SN_Sku":"11","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 22:37"},
{"Sku":"1","Img":"","InternalName":"天然纯正即食燕窝-2","InternalEnglishName":"Vitarealm Premium Birds Nest 6 bottles*226*2g","JD_Sku":"1","TM_Sku":"Birds Nest-2","SN_Sku":"12","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 23:37"},
{"Sku":"0","Img":"","InternalName":"畅快纤梅","InternalEnglishName":"VitaRealm Justume 20 pieces","JD_Sku":"1981524549","TM_Sku":"Justume","SN_Sku":"13","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031157","Img":"","InternalName":"关节康","InternalEnglishName":"VitaRealm PowerJoint 80 capsules","JD_Sku":"1981449701","TM_Sku":"PowerJoint","SN_Sku":"14","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031218","Img":"","InternalName":"前列康","InternalEnglishName":"VitaRealm PowerProstate 80 capsules","JD_Sku":"1995154703/1986162600","TM_Sku":"PowerProstate","SN_Sku":"15","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031171","Img":"","InternalName":"精力康","InternalEnglishName":"VitaRealm PowerMan 60 capsules","JD_Sku":"1981540685","TM_Sku":"PowerMan","SN_Sku":"16","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006032680","Img":"","InternalName":"芦荟美颜软胶囊","InternalEnglishName":"VitaRealm DetoxCleanse 90 capsules","JD_Sku":"18372989051","TM_Sku":"DetoxCleanse","SN_Sku":"17","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006032697","Img":"","InternalName":"威乐燃脂瘦","InternalEnglishName":"VitaRealm Fat Burner 90 capsules","JD_Sku":"18377332828","TM_Sku":"Fat Burner","SN_Sku":"18","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031607","Img":"","InternalName":"保肝康","InternalEnglishName":"VitaRealm PowerLiver 80 capsules","JD_Sku":"1981528360","TM_Sku":"PowerLiver","SN_Sku":"19","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031584","Img":"","InternalName":"睡香甜","InternalEnglishName":"VitaRealm SleepEasy 80 capsules","JD_Sku":"1981558578","TM_Sku":"SleepEasy","SN_Sku":"20","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031515","Img":"","InternalName":"脑力康","InternalEnglishName":"VitaRealm PowerBrain 80 capsules","JD_Sku":"1981551035","TM_Sku":"PowerBrain","SN_Sku":"21","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006032291","Img":"","InternalName":"儿童高钙宝","InternalEnglishName":"VitaRealm PowerBone Kids 90 capsules","JD_Sku":"1994868166","TM_Sku":"PowerBone Kids","SN_Sku":"22","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"8885006031140","Img":"","InternalName":"骨钙康","InternalEnglishName":"VitaRealm PowerBone 90 capsules","JD_Sku":"1981555900","TM_Sku":"PowerBone","SN_Sku":"23","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 10:37"},
{"Sku":"8885006032321","Img":"","InternalName":"儿童健脑宝","InternalEnglishName":"VitaRealm PowerBrain Kids 90 capsules","JD_Sku":"1989027739/1983243223","TM_Sku":"PowerBrain Kids","SN_Sku":"24","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 11:37"},
{"Sku":"8885006032536","Img":"","InternalName":"合生元益生菌益生元","InternalEnglishName":"VitaRealm synbiotics 90 capsules","JD_Sku":"1993419606","TM_Sku":"synbiotics","SN_Sku":"25","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 12:37"},
{"Sku":"8885006032987","Img":"","InternalName":"干细胞修复胶原蛋白饮","InternalEnglishName":"Skin Perfecting Essence 8 bottles","JD_Sku":"27870247997","TM_Sku":"Skin Perfecting Essence","SN_Sku":"26","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 13:37"},
{"Sku":"8885006032512","Img":"","InternalName":"美白胶原蛋白饮","InternalEnglishName":"VitaRealm Whitening Collagen 8 bottles","JD_Sku":"24287993232","TM_Sku":"WhiteningCollagen","SN_Sku":"27","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 14:37"},
{"Sku":"8885006031539","Img":"","InternalName":"儿童维多宝","InternalEnglishName":"VitaRealm PowerImmune Kids 60 tablets","JD_Sku":"1981442273","TM_Sku":"PowerImmune Kids","SN_Sku":"28","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 15:37"},
{"Sku":"8885006031300","Img":"","InternalName":"儿童视力宝","InternalEnglishName":"VitaRealm PowerEye Kids 60 tablets","JD_Sku":"1994861440/1981390146","TM_Sku":"PowerEye Kids","SN_Sku":"29","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 16:37"},
{"Sku":"8885006031164","Img":"","InternalName":"更年康","InternalEnglishName":"VitaRealm MenoCare 90 capsules","JD_Sku":"1981549150","TM_Sku":"MenoCare","SN_Sku":"30","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 17:37"},
{"Sku":"8885006031652","Img":"","InternalName":"畅快纤梅","InternalEnglishName":"VitaRealm Justume 10 pieces","JD_Sku":"0","TM_Sku":"Justume10s","SN_Sku":"31","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 18:37"},
{"Sku":"8885006033083","Img":"","InternalName":"综合维生素泡腾片","InternalEnglishName":"VitaRealm Multivitamin 20 tablets","JD_Sku":"1","TM_Sku":"Multivitamin","SN_Sku":"32","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 19:37"},
{"Sku":"0","Img":"","InternalName":"维C泡腾片","InternalEnglishName":"VitaRealm VitaminC 20 tablets","JD_Sku":"1986514750","TM_Sku":"VitaminC","SN_Sku":"33","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 20:37"},
{"Sku":"0","Img":"","InternalName":"麦卢卡蜂蜜","InternalEnglishName":"HoneyRealm Manuka Honey UMF10+ 500g","JD_Sku":"0","TM_Sku":"HoneyRealm Manuka Honey","SN_Sku":"34","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 21:37"},
{"Sku":"8885006030785","Img":"","InternalName":"维C泡腾片五瓶装","InternalEnglishName":"VitaRealm Vitamin C 20 tablets","JD_Sku":"1986514749","TM_Sku":"VitaminC-5","SN_Sku":"35","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 22:37"},
{"Sku":"8885006031195","Img":"","InternalName":"脚贴","InternalEnglishName":"VitaRealm Patch 10 packs","JD_Sku":"1986714535","TM_Sku":"Patch","SN_Sku":"36","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/25 23:37"},
{"Sku":"8885006030983","Img":"","InternalName":"阿拉斯加深海鱼油300粒装","InternalEnglishName":"VitaRealm Fish Oil 300 capsules","JD_Sku":"1998662637","TM_Sku":"FO300","SN_Sku":"37","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"儿童益菌宝两瓶装","InternalEnglishName":"Powerbiotics Kids 90 tablets-2","JD_Sku":"0","TM_Sku":"Powerbiotics Kids-2","SN_Sku":"38","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"脚贴-2","InternalEnglishName":"Patch","JD_Sku":"0","TM_Sku":"Patch-2","SN_Sku":"39","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"脚贴-3","InternalEnglishName":"Patch","JD_Sku":"0","TM_Sku":"Patch-3","SN_Sku":"40","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"亮眼康两瓶装","InternalEnglishName":"VitaRealm PowerEye 60 capsules","JD_Sku":"1981552695","TM_Sku":"PowerEye-2","SN_Sku":"41","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"0","Img":"","InternalName":"威乐燃脂瘦两盒装","InternalEnglishName":"VitaRealm Fat Burner 90 capsules","JD_Sku":"0","TM_Sku":"Fat Burner-2","SN_Sku":"42","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"1","Img":"","InternalName":"儿童视力宝两瓶装","InternalEnglishName":"VitaRealm PowerEye Kids-2 60 tablets","JD_Sku":"1994861439/1981390145","TM_Sku":"PowerEye Kids-2","SN_Sku":"43","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"2","Img":"","InternalName":"美白胶原蛋白饮两盒装","InternalEnglishName":"VitaRealm WhiteningCollagen","JD_Sku":"0","TM_Sku":"WhiteningCollagen-2","SN_Sku":"44","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"3","Img":"","InternalName":"儿童健脑宝两瓶装","InternalEnglishName":"VitaRealm PowerBrain Kids-2 60 capsules","JD_Sku":"1994894622","TM_Sku":"PowerBrain Kids-2","SN_Sku":"45","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"4","Img":"","InternalName":"儿童维多宝两瓶装","InternalEnglishName":"VitaRealm PowerImmune Kids-2 60 tablets","JD_Sku":"1994885890/1981442272","TM_Sku":"PowerImmune Kids-2","SN_Sku":"46","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/24 15:37"},
{"Sku":"5","Img":"","InternalName":"儿童高钙宝两瓶装","InternalEnglishName":"VitaRealm PowerBone Kids-2 90 tablets","JD_Sku":"19607698573","TM_Sku":"PowerBone Kids-2","SN_Sku":"47","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 10:37"},
{"Sku":"6","Img":"","InternalName":"畅快纤梅两盒装","InternalEnglishName":"VitaRealm Justume-2 20 pieces","JD_Sku":"1981524550","TM_Sku":"Justume-2","SN_Sku":"48","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 11:37"},
{"Sku":"7","Img":"","InternalName":"精力康两瓶装","InternalEnglishName":"VitaRealm PowerMan 60 capsules","JD_Sku":"1981540686","TM_Sku":"PowerMan-2","SN_Sku":"49","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 12:37"},
{"Sku":"8","Img":"","InternalName":"睡香甜两瓶装","InternalEnglishName":"VitaRealm SleepEasy 80 capsules","JD_Sku":"1981558579","TM_Sku":"SleepEasy-2","SN_Sku":"50","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 13:37"},
{"Sku":"9","Img":"","InternalName":"心血康两瓶装","InternalEnglishName":"VitaRealm PowerHeart 80 capsules","JD_Sku":"1981566629","TM_Sku":"PowerHeart-2","SN_Sku":"51","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 14:37"},
{"Sku":"10","Img":"","InternalName":"更年康两瓶装","InternalEnglishName":"VitaRealm MenoCare-2 90 capsules","JD_Sku":"1981549151","TM_Sku":"MenoCare-2","SN_Sku":"52","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 15:37"},
{"Sku":"11","Img":"","InternalName":"前列康两瓶装","InternalEnglishName":"VitaRealm PowerProstate 80 capsules","JD_Sku":"无","TM_Sku":"PowerProstate-2","SN_Sku":"53","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 16:37"},
{"Sku":"12","Img":"","InternalName":"骨钙康两瓶装","InternalEnglishName":"VitaRealm PowerBone 90 capsules","JD_Sku":"1981555899","TM_Sku":"PowerBone-2","SN_Sku":"54","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 17:37"},
{"Sku":"13","Img":"","InternalName":"泌尿康两瓶装","InternalEnglishName":"VitaRealm PowerBladder 60 capsules","JD_Sku":"1981566991","TM_Sku":"PowerBladder-2","SN_Sku":"55","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 18:37"},
{"Sku":"14","Img":"","InternalName":"脑力康两瓶装","InternalEnglishName":"VitaRealm PowerBrain 80 capsules","JD_Sku":"1981551034","TM_Sku":"PowerBrain-2","SN_Sku":"56","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 19:37"},
{"Sku":"15","Img":"","InternalName":"关节康两瓶装","InternalEnglishName":"VitaRealm PowerJoint 80 capsules","JD_Sku":"1981440800","TM_Sku":"PowerJoint-2","SN_Sku":"57","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 20:37"},
{"Sku":"16","Img":"","InternalName":"保肝康两瓶装","InternalEnglishName":"VitaRealm PowerLiver 80 capsules","JD_Sku":"1981528361","TM_Sku":"PowerLiver-2","SN_Sku":"58","IsMultiple":"0","JoinProductID":"0","JoinProductSum":"0","AddTime":"2019/11/26 21:37"},
]
data.map( async item => {
  await addGoods(item)
})
    },
    async addGoods() {
      var data = this.form;
      data.Img = "";
      const res = await addGoods(data);
      if (res.Code == 200) {
        this.dialogFormVisible = true;
        this.getGoodsList();
      }
      console.log(JSON.stringify(res));
    },
    async getGoodsList() {
      var data = this.search;
      const res = await getGoodsList(data);
      if (res.Code == 200) {
        this.tableData = res.Data;
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 100%;
  padding: 20px;
}
.h20 {
  width: 100%;
  height: 20px;
}
</style>
