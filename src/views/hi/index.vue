<template>
  <div class="hi-wrap">
    <div class="nav"></div>
    <h3 class="title">您好！👋</h3>
    <p>本人主业前端开发，业余喜欢写一些有意思的东西。</p>
    <p class="red">
      <b>
        如果您和我没有任何交集，无论您是从哪里了解到该项目（本人其实没有怎么推广）添加到我，在这里说先一句抱歉！总而言之，我并不能免费解答/解决您的解决问题！
      </b>
    </p>
    <p>
      如果您是我的同事、朋友等等任何和我有交集的人，<span class="red">
        咨询技术、部署等任何问题都完全免费！
      </span>
    </p>

    <h3>Github</h3>
    <li>所有项目累计收到2.2k star</li>
    <li class="red">本人在github上公开的项目完全免费，可商用！</li>
    <li>
      初心仅仅是记录自己的开发的过程，并不是为爱发电（专门写东西给大家用）。
    </li>
    <li class="red">
      对于开源，无限欢迎！！！在github上给我提Issue或者Pr，我都会看！！！
    </li>
    <h3>咨询问题</h3>
    <div>添加好友咨询的任何我所认为付费的问题，请付费咨询（100元/小时）。</div>
    <h3>私有化部署</h3>
    <li>咨询任何我所认为付费的问题（包括私有化/定制化部署），100元/小时。</li>
    <li>
      <span
        class="link"
        @click="router.push({ name: routerName.privatizationDeployment })"
      >
        查看详情
      </span>
    </li>
    <h3>远程支持</h3>
    <li>定价：200元/小时。<span class="red">不保证解决问题！</span></li>
    <h3>为什么在我这什么都要付费？</h3>
    <li>
      <span class="red">
        <b>我个人很反对这种付费咨询，因此我极其不建议您付费！！！</b>
      </span>
      我更希望大家都能独立自主解决问题，而不是直接从别人口中得到答案！！！而且花了钱还不一定解决问题，凭什么？
    </li>
    <li>有志者，事竟成。如果您非要花钱，那我一定尽力解答/解决您的问题！！！</li>
    <li>时间就是金钱。</li>

    <h3 class="red">道不同不相为谋</h3>
    <li>钱能解决的问题就不是问题！贵不是它的缺点，而是您的缺点。</li>
    <li>
      本人倾向于独当一面，但遇到非常困难的问题的时候，我愿意花钱试错，如果您不能承担试错成本，那我们无话可说。
    </li>
    <h3 class="red">物以类聚，人以群分</h3>
    <li>如果您觉得和我不是一类人，直接拉黑删除我即可。</li>
    <li>如果我觉得和您不是一类人，我也会将您拉黑删除。</li>
    <h3>什么人不要添加我</h3>
    <li>单纯只是因为业务需要才学的，而不是自己感兴趣的！</li>
    <li>
      大家都是平等的，我不图您任何东西，包括钱，别以为我很想挣您的钱。并且是您添加我，我认为是您有求于我，交流时不要带命令式语气等等。
    </li>
    <h3>关于开源</h3>
    <li>其实只有我自己一个人开发/维护。</li>
    <li>
      开源的仓库只是作为我自己的dev环境，好像也没有帮助到大家，谈不上开源。
    </li>
    <li>任何有关开源上面的内容，都在开源上面解决即可，没必要添加作者去问。</li>
    <h3>关于作者</h3>
    <li>努力在各方面都做到独当一面。</li>
    <h3>最后</h3>
    <li>
      <span>
        本人不善交际，也不需要什么社交，如果您添加到我了，而我并未达到您预期的状态，或未从我这得到您预期的东西等等，
      </span>
      <span class="red"><b>真的非常非常抱歉！</b></span>
    </li>
    <li>
      柯林斯在《从优秀到卓越》中特别提到要找“训练有素”的人，要将合适的人请上车，不合适的人请下车。<span
        class="red"
        >（您如果觉得我不合适，欢迎果断的请我下车；反之我如果觉得您不合适，我也会立即请您下车）</span
      >
    </li>
    <h3>联系作者</h3>
    <li class="red">！！！请仔细阅读上面的内容，再考虑是否添加！！！</li>
    <li>添加前请充分了解billd-live项目！</li>
    <li>添加时备注来意，否则不通过！</li>
    <li>微信：{{ AUTHOR_INFO.wechat }}</li>
    <li>QQ：{{ AUTHOR_INFO.qq }}</li>
  </div>
</template>

<script lang="ts" setup>
import { AUTHOR_INFO } from '@/constant';
import router, { routerName } from '@/router';
</script>

<style lang="scss" scoped>
.hi-wrap {
  overflow: scroll;
  box-sizing: border-box;
  padding-bottom: 10px;
  padding-left: 40px;
  height: 100%;
  background-color: #f4f8ff;
  &:hover {
    @extend %customScrollbar;
  }

  .nav {
    padding: 10px;
  }
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }

  .title {
    margin: 0;
    font-size: 22px;
  }
  .red {
    color: red;
  }
  li {
    margin: 6px 0;
  }
}
</style>
