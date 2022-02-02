var realGain = n(0)
var realHGain = n(0)
var realYGain = n(0)
function sc(num){
  var root = n(1.33)
  var exprt = n(1.5)
  return expRoot(num.add(1).root(root).add(9),exprt).sub(10)
}
function antiSc(num){
  var root = n(1.33)
  var exprt = n(1.5)
  return expPow(num.add(10),exprt).sub(9).pow(root).sub(1)
}
addLayer("m", {
    name: "meta", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HLNY",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
    }},
    effectDescription() {
        return `新年快乐! - Happy Lunar New Year!<br>于1月31号19点开始创作!`
    },
    color: "white",
    resource: "欢庆点", // Name of prestige currency
    type: "none",
    row: 9, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return hasUpgrade('mm',21)},
    update(diff){
      //产量
      var gain = n(1)
      gain = gain.mul(buyableEffect('h',11))
      gain = gain.mul(buyableEffect('h',12))
      gain = gain.mul(buyableEffect('h',21))
      gain = gain.mul(buyableEffect('h',22))
     
      gain = gain.mul(layers.l.effect())
      gain = gain.mul(buyableEffect('n',13))
     
      gain = gain.pow(buyableEffect('h',13))
      gain = gain.pow(buyableEffect('h',14))
      gain = gain.pow(buyableEffect('h',23))
      gain = gain.pow(buyableEffect('h',24))
      //计算
      var lastP = player.points
      player.points = sc(antiSc(player.points).add(gain.mul(diff)))
      realGain = player.points.sub(lastP).div(diff)
      player[this.layer].points = player.points.add(1).log10().cbrt()
    },
    upgrades:{
      11:{
        title:'Happy - The Happiness Incrementer',
        description:'解锁快乐增量器.',
        cost:n(1),
      },
      12:{
        title:'Lunar - Touhou Luna Night',
        description:'解锁东方月神夜(?',
        cost:n(2),
        unlocked(){return hasUpgrade('m',11)},
      },
      13:{
        title:'New - News',
        description:'解锁新闻条.',
        cost:n(3),
        unlocked(){return hasUpgrade('m',12)},
      },
      14:{
        title:'Year - Clock',
        description:'解锁钟表.',
        cost:n(4),
        unlocked(){return hasUpgrade('m',13)},
      },
    },
})

addLayer("h", {
    name: "happy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HAPPY",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
    }},
    color: "white",
    resource: "快乐增量点", // Name of prestige currency
    type: "none",
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return hasUpgrade('m',11)},
    effectDescription(){return `+ ${format(realHGain)} /s`},
    buyables:{
          11: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return x.mul(5).add(10)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1) },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return "快乐+"
            },
            display() {
                return `倍增快乐点.该效果被计入快乐增量点公式.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 点数`
            },
            buy() {
                var bulk = addBulkBuy(player.points,10,getBuyableAmount(this.layer,this.id),5)
                if(!hasUpgrade('l',13))player.points = player.points.sub(bulk.cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk.bulk))
            },
            abtick:0,abdelay(){return hasUpgrade('l',13)?0:1.797e308},unlocked(){return true},
        },
        12: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1.25).pow(x).mul(20)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.1).pow(x) },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return "快乐x"
            },
            display() {
                return `倍增快乐点.该效果被计入快乐增量点公式.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 点数`
            },
            buy() {
                if(!hasUpgrade('l',12))player.points = player.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',12)?0:1.797e308},unlocked(){return true},
        },
        13: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(4).pow(x.add(1).pow(1.25).sub(1)).mul(100)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1).root(12.5) },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return "快乐^"
            },
            display() {
                return `指数增幅快乐点.该效果被计入快乐增量点公式.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 点数`
            },
            buy() {
                player.points = player.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',11)?0:1.797e308},unlocked(){return true},
        },
        14: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(4).pow(x.add(1).pow(1.33).sub(1)).mul(250)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(player.h.resetTime).add(1).root(20.220201).pow(x.add(1).root(4).sub(1)) },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return "快乐Δt"
            },
            display() {
                return `基于时间指数增幅快乐点.该效果被计入快乐增量点公式.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 点数`
            },
            buy() {
                player.points = player.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',11)?0:1.797e308},unlocked(){return true},
        },
        21: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return x.mul(3).add(1)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量+"
            },
            display() {
                return `倍增快乐点.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 快乐增量点`
            },
            buy() {
                var bulk = addBulkBuy(player[this.layer].points,1,getBuyableAmount(this.layer,this.id),3)
                if(!hasUpgrade('l',13))player[this.layer].points = player[this.layer].points.sub(bulk.cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk.bulk))
            },
            abtick:0,abdelay(){return hasUpgrade('l',13)?0:1.797e308},unlocked(){return true},
        },
        22: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1.2).pow(x).mul(5)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.1).pow(x) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量x"
            },
            display() {
                return `倍增快乐点.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 快乐增量点`
            },
            buy() {
                if(!hasUpgrade('l',12))player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',12)?0:1.797e308},unlocked(){return true},
        },
        23: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(2).pow(x.add(1).pow(1.25).sub(1)).mul(50)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1).root(12.5) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量^"
            },
            display() {
                return `指数增幅快乐点.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 快乐增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',11)?0:1.797e308},unlocked(){return true},
        },
        24: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(2).pow(x.add(1).pow(1.33).sub(1)).mul(75)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(player.h.resetTime).add(1).root(20.220201).pow(x.add(1).root(4).sub(1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量Δt"
            },
            display() {
                return `基于时间指数增幅快乐点.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 快乐增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return hasUpgrade('l',11)?0:1.797e308},
            unlocked(){return true},
        },
    },
    update(diff){
      var gain = buyableEffect('h',11)
      gain = gain.mul(buyableEffect('h',12))
      if(hasUpgrade('l',12)) gain = gain.mul(layers.l.effect().pow(hasUpgrade('l',14)?1:0.5))
      gain = gain.pow(buyableEffect('h',13))
      gain = gain.pow(buyableEffect('h',14)).sub(1).div(10)
      
      
      var p = player.h.points
      player.h.points = sc(antiSc(player.h.points).add(gain.mul(diff)))
      realHGain = player.h.points.sub(p).div(diff)
      
      for(row=1;row<=2;row++){       
      for(col=1;col<=4;col++){ 
      if(layers[this.layer].buyables[row*10+col]){            
        layers[this.layer].buyables[row*10+col].abtick += diff
        if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked() && layers[this.layer].buyables[row*10+col].canAfford()){
          layers[this.layer].buyables[row*10+col].buy()
          layers[this.layer].buyables[row*10+col].abtick = 0
            } 
          }        
        }    
      }
      
      
    },
})

addLayer("l", {
    name: "lunar", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LUNAR",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new ExpantaNum(0),
		    knives: n(0),
		    score: n(0),
		    power: n(0),
		    energy: n(0),
		    health: n(100),
		    skill2: n(0),
		    alertTxt: true,
    }},

    color: "white",
    resource: "压岁钱", // Name of prestige currency
    type: "normal",
    exponent:0.75,
    baseAmount(){return player.points},
    baseResource:'点数',
    requires:n(1e8),
    gainMult(){
      var mult = n(1)
      mult = mult.mul(buyableEffect('n',11))
      return mult
    },
    gainExp(){
      var exp = n(1)
      return exp
    },
    effect(){
      return player.l.score.div(308).add(1)
    },
    effectDescription(){
      return `
      分数:${format(player.l.score)}(投掷飞刀以获得!) 快乐点x${format(this.effect())}<br>
      力量:${format(player.l.power)}(基于快乐点获得!) 分数获取x${format(player.l.power.div(10).add(1))}<br>
      能量:${format(player.l.energy)}/100(投掷飞刀以获得!)<br>
      血量:${format(player.l.health)}/100(-5/s) 归零后分数/1.25.
      `
    },
    clickables:{
      11:{
        title:'能量飞刀(20)',
        display:'立即恢复所有飞刀.',
        canClick(){return player.l.energy.gte(20)},
        onClick(){
          player.l.energy = player.l.energy.sub(20)
          player.l.knives = buyableEffect('l',11)
        },
      },
      12:{
        title(){return `时间定格(60)(${format(player.l.skill2)}s)`},
        display:'持续时间10s.你无法自动恢复飞刀,生命停止降低,飞刀投掷速度x5,力量x5.过程中无法获得能量.',
        canClick(){return player.l.energy.gte(60)},
        onClick(){
          player.l.energy = player.l.energy.sub(60)
          player.l.skill2 = n(10)
        },
      },
      13:{
        title(){return `禁用强化警告弹窗.`},
        display(){return `当前状态:${player.l.alertTxt?'已启用':'已禁用'}`},
        unlocked(){return hasUpgrade('l',21)},
        canClick(){return true},
        onClick(){
          player.l.alertTxt = !player.l.alertTxt
        },
      },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    buyables:{
      11: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return x.add(1)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.mul(100) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "买飞刀"
            },
            display() {
                return `用你的压岁钱给咲夜买飞刀.<br>
                ${format(player[this.layer].knives.floor())}个当前可使用的飞刀.<br>
                ${format(this.effect().sub(player[this.layer].knives).ceil().min(buyableEffect('l',11)))}个飞刀等待回收.<br>
                    总飞刀数:${format(this.effect())}<br>
                    价格: ${format(this.cost())} 零花钱`
            },
            buy() {
                var bulk = addBulkBuy(player[this.layer].points,1,getBuyableAmount(this.layer,this.id),1)
                player[this.layer].points = player[this.layer].points.sub(bulk.cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk.bulk))
            },
        },
        12: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return ten.pow(expRoot(this.getResetGain().add(11),1.33).sub(10).root(4).mul(5)).sub(1)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return buyableEffect('l',11).add(1).log10().add(1).pow(x.add(1).pow(2).log10().pow(1.5)) },
            canAfford() { return this.getResetGain().gte(1) },
            title() {
                return "强化飞刀"
            },
            display() {
                return `用大量飞刀堆强化等级.<br>
                当前强化等级:+${getBuyableAmount('l',12)}<br>
                您当前可以在此基础上强化 ${format(this.getResetGain())} 级,下一强化等级需要 ${format(this.cost())} 飞刀<br>
                强化使得力量基于飞刀增加.(x${format(this.effect())})(强化后:x${format(this.effect(getBuyableAmount('l',12).add(this.getResetGain())))})<br>
                强化只会保留100把飞刀,并重置你的压岁钱,进行一次压岁钱重置!
                `
            },
            getResetGain(){
              return expPow(buyableEffect('l',11).add(1).log10().div(5).pow(4).add(10),1.33).sub(10).floor()
            },
            buy() {
              if(player.l.alertTxt) if(!confirm('你确定强化飞刀么?')) return
                var bulk = this.getResetGain()
                player.l.points = n(0)
                player[this.layer].buyables[11] = n(1)
                doReset(this.layer,true)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player[this.layer].score = n(0)
            },
            unlocked(){return hasUpgrade('l',21)},
        },
    },
    layerShown(){return hasUpgrade('m',12)},
    update(diff){
      var knives = player.l.knives.floor()
      var throwSpeed = knives.div(40)
      player.l.power = player.points.add(10).log10().pow(2)
      if(hasUpgrade('l',22)) player.l.power = player.l.power.pow(upgradeEffect('l',22))
      if(player.l.skill2.gt(0)) player.l.power = player.l.power.mul(5)
      player.l.power = player.l.power.mul(buyableEffect('l',12))
      if(player.l.skill2.gt(0)) throwSpeed = throwSpeed.mul(5)
      player.l.knives = player.l.knives.sub(throwSpeed.mul(diff).ceil()).max(0)
      player.l.score = player.l.score.add(throwSpeed.mul(diff).ceil().mul(player.l.power.div(10).add(1)))
      if(!player.l.skill2.gt(0))player.l.energy = player.l.energy.add(throwSpeed.add(1).log10().mul(diff).mul(3)).min(100)
      var knivesToRecover = buyableEffect('l',11).sub(player.l.knives).ceil()
      var recoverSpeed = knivesToRecover.div(10)
      if(player.l.skill2.gt(0)) recoverSpeed = n(0)
      player.l.knives = player.l.knives.add(recoverSpeed.mul(diff)).min(buyableEffect('l',11))
      if(!player.l.skill2.gt(0))player.l.health = player.l.health.sub(5*diff)
      if(player.l.health.lte(0)){
        player.l.health = n(100)
        player.l.score = player.l.score.div(1.25)
      }
      player.l.skill2 = player.l.skill2.sub(diff).max(0)
    },
    upgrades:{
      11:{
        description:'允许您自动购买快乐^和Δt,增量^和Δt.',
        cost:n(1000),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
      12:{
        description:'分数增幅的快乐削减后计入快乐增量点公式中.自动购买快乐x和增量x,并且免费.',
        cost:n(100000),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
      13:{
        description:'增量+和快乐+不再消耗点数,并且自动购买.(批量数量仍未改变)',
        cost:n(1000000),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
      14:{
        description:'取消第二个升级的削减.',
        cost:n(2500000),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
      21:{
        description:'解锁飞刀强化.您可能并不急需强化.',
        cost:n(1e9),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
      22:{
        description:'快乐^Δt,增量^Δt均以一定程度增幅基础力量值.',
        effect(){
          var exp = buyableEffect('h',13).mul(buyableEffect('h',14)).mul(buyableEffect('h',23)).mul(buyableEffect('h',24)).root(1.33)
          return exp
        },
        effectDisplay(){
          return `^${format(this.effect())}`
        },
        cost:n(1e15),
        currencyDisplayName:'分数',
        canAfford(){return player.l.score.gte(this.cost)},
        pay(){player.l.score = player.l.score.sub(this.cost)}
      },
    },
    doReset(layer){
      if(layers[layer].row > this.row) layerDataReset(this.layer)
      else{
        player.l.score = n(0)
        player.l.power = n(0)
        player.l.energy = n(0)
      }
    },
})

function getNews(){var news = [
  {id:0,txt:`反物质维度,上线即送一元红包!`},
  {id:1,txt:`脉动,瞬间让你脉动回来!`},
  {id:2,txt:`小知识:有一句话叫做乐极生悲.`},
  {id:3,txt:`某新闻部门因传播谣言被停止运营.`},
  ]
  var searchNews = [
    {id:4,txt:`最近有一起为反谣言而举行的募捐活动.`},
    {id:5,txt:`现实总是残酷的.`},
    {id:6,txt:`反物质魔方,不要九块八,只要九块九毛八!.`},
    {id:7,txt:`研究表明,快乐的时光总是短暂的.`},
  ]
  var searchNum = buyableEffect('n',21).toNumber()-4
  for(i=0;i<searchNum;i++){
    news.push(searchNews[i])
  }
  return news
}

addLayer("n", {
    name: "new", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NEW",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
		    news:{id:0,txt:`反物质维度,上线即送一元红包!`},
		    cd:n(0),
		    sadness:n(0),
    }},
    color: "white",
    resource: "现实点", // Name of prestige currency
    type: "none",
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return hasUpgrade('m',13)},
    effectDescription(){
      return `<br><br><br>今日新闻:${player.n.news.txt}<br>${format(player.n.cd)}秒后更新.<br>${player.n.sadness.gt(0)?`悲伤点:${format(player.n.sadness)}`:''}`
    },
    clickables:{
      11:{
        title(){return `白嫖一块钱.`},
        unlocked(){return player.n.news.id == 0||clockSpeed>15},
        canClick(){return true},
        onClick(){
          player.l.points = player.l.add(1)
        },
      },
      12:{
        title(){return `花5元钱买脉动.(能量恢复至max)`},
        unlocked(){return player.n.news.id == 1||clockSpeed>15},
        canClick(){return player.l.points.gte(5)},
        onClick(){
          player.l.points = player.l.points.sub(5)
          player.l.energy = n(100)
        },
      },
    },
    buyables:{
      11: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1.125).pow(x.pow(1.04)).mul(5)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.1).pow(x.pow(1.33)) },
            canAfford() { return player[this.layer].sadness.gte(this.cost()) },
            title() {
                return "卖惨"
            },
            display() {
                return `利用买惨的方式讨压岁钱.<br>
                压岁钱x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 悲伤点`
            },
            buy() {
                player[this.layer].sadness = player[this.layer].sadness.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},unlocked(){return player.n.sadness.gt(0)},
        },
        12: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1.2).pow(x).mul(5)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.2).pow(x).mul(x.add(1).sqrt()) },
            canAfford() { return player[this.layer].points.gte(this.cost())&&(player.n.news.id == 5||clockSpeed>15) },
            title() {
                return "探索真实"
            },
            display() {
                return `通过新闻,了解真正的社会.(购买需要事件:现实总是残酷的)<br>
                悲伤点x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 现实点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},unlocked(){return player.n.news.id == 5||getBuyableAmount(this.layer,this.id).gt(0)},
        },
        13: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1e3).pow(x.add(1).pow(1.325).sub(1)).mul(1e25)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1e3).pow(x.pow(1.25)) },
            canAfford() { return player.l.points.gte(this.cost())&&(player.n.news.id == 6||clockSpeed>15) },
            title() {
                return "反物质魔方"
            },
            display() {
                return `买亿些反物质魔方玩玩.(购买要求事件:反物质魔方)<br>
                快乐点x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 压岁钱`
            },
            buy() {
                player.l.points = player.l.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},
            unlocked(){return player.n.news.id == 6||getBuyableAmount(this.layer,this.id).gt(0)},
        },
        14: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(10).pow(n(1.5).pow(x.pow(1.33)).mul(64))
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.25).pow(x) },
            canAfford() { return player.points.gte(this.cost())&&(player.n.news.id == 7||clockSpeed>15) },
            title() {
                return "思维加速器"
            },
            display() {
                return `用快乐加速你的认知时间.(购买要求事件:快乐的时光总是短暂的)<br>
                时间速率x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 快乐点`
            },
            buy() {
                player.points = player.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},
            unlocked(){return player.n.news.id == 7||getBuyableAmount(this.layer,this.id).gt(0)},
        },
        21: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              x = x.toNumber()
              switch (x) {
                case 0:return n(4)
                case 1:return n(16)
                case 2:return n(64)
                case 3:return n(256)
              }
              return n('ee308)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(4) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "搜索引擎"
            },
            display() {
                return `搜索更多新闻条.<br>
                当前新闻条总数: ${format(this.effect())}.<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 现实点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},unlocked(){return player.n.sadness.gt(0)},
        },
        22: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return ten.pow(x.add(1).pow(1.33).sub(1)).mul(1e15)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return n(1.25).pow(x) },
            canAfford() { return player.l.points.gte(this.cost())&&(player.n.news.id == 4||clockSpeed>15) },
            title() {
                return "反谣言募捐"
            },
            display() {
                return `利用捐钱的方式反制谣言.(购买需要事件:反谣言募捐)<br>
                现实点x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 压岁钱`
            },
            buy() {
                player.l.points = player.l.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},
            unlocked(){return player.n.news.id == 4||getBuyableAmount(this.layer,this.id).gt(0)},
        },
        
    },
    update(diff){
      //更新新闻条
      player.n.cd = player.n.cd.sub(diff)
      if(player.n.cd.lte(0)){
        player.n.cd = n(15)
        var news = getNews()
        player.n.news = news[Math.floor(Math.random()*news.length)]
      }
     //新闻2：乐极生悲
     if(player.n.news.id == 2 || player.n.news.id == 5){
       var proc = expPow(player.points.add(1).log10().div(27).pow(4).add(10),1.33).sub(10)
       proc = proc.mul(buyableEffect('n',12))
       player.n.sadness = player.n.sadness.add(proc.mul(diff))
     }
     //新闻3：新闻造谣
     if(player.n.news.id == 3){
       var proc = n(0.1)
       proc = proc.mul(buyableEffect('n',22))
       player.n.points = player.n.points.add(proc.mul(diff))
     }
    },
})


var clockSpeed = 1

addLayer("y", {
    name: "year", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "YEAR",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
    }},
    color: "white",
    resource: "时间点", // Name of prestige currency
    type: "none",
    row: 4, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return hasUpgrade('m',14)},
    effectDescription(){
      return `+ ${format(realYGain)} /真实秒<br>时间速率:x${format(n(clockSpeed))}`
    },
    buyables:{      
      11: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(1.2).pow(x).mul(10)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1) },
            canAfford() { return player.y.points.gte(this.cost()) },
            title() {
                return "时间节点#1"
            },
            display() {
                return `
                时间速率x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 时间点`
            },
            buy() {
                player.y.points = player.y.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},
        },
        12: {
            cost(x = getBuyableAmount(this.layer,this.id)) { 
              return n(3).pow(x).mul(80)
            },
            effect(x = getBuyableAmount(this.layer,this.id)) { return x.add(1).pow(2) },
            canAfford() { return player.y.points.gte(this.cost()) },
            title() {
                return "时间节点#2"
            },
            display() {
                return `
                时间速率x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount(this.layer,this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}<br>
                    价格: ${format(this.cost())} 时间点`
            },
            buy() {
                player.y.points = player.y.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            abtick:0,abdelay(){return 1.797e308},
        },
    },
    update(diff){
      if(!hasUpgrade('m',14)) return
      clockSpeed = n(1)
      clockSpeed = clockSpeed.mul(buyableEffect('y',11))
      clockSpeed = clockSpeed.mul(buyableEffect('y',12))
      //clockSpeed = clockSpeed.mul(buyableEffect('y',13))
      clockSpeed = clockSpeed.mul(buyableEffect('n',14))
      var p = player.y.points
      player.y.points = sc(antiSc(player.y.points).add(diff))
      realYGain = player.y.points.sub(p).div(diff/clockSpeed)
    }
})
