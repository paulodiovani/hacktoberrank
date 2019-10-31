<template>
  <div class="list-pull-request">
    <div class="pr-title">Hacktober Fest 2019</div>
    <div class="pr-list">
      <div
        v-for="(user, userIndex) in users"
        v-bind:key="userIndex"
        class="pr-item"
        @mouseover="setHover(userIndex, true)"
        @mouseleave="setHover(userIndex, false)"
      >
        <template v-if="userIndex < 3">
          <img
            class="medal"
            :src="require('@/assets/' + svgMedal(userIndex))"
          />
        </template>
        <div class="pr-rank-outter">
          <div class="hover-effect">#{{ userIndex + 1 }}</div>
          <span class="pr-rank">#{{ userIndex + 1 }}</span>
        </div>
        <div class="pr-username">{{ user.username }}</div>
        <ul class="pr-links">
          <li
            v-for="(pr, index) in slicePRs(user)"
            v-bind:key="index"
            class="pr-li"
          >
            <a :href="pr" class="pr-link">{{ pr | cutPRLink }}</a>
          </li>
        </ul>
      </div>
    </div>
    <loader ref="pageBottom" />
  </div>
</template>

<script>
import api from '../api'
import Loader from '@/components/Loader.vue'

// Define the observer
let observer
// Define observer Callback
let observerCallBack = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.$notifyInView()
    }
  })
}

export default {
  name: 'ListPullRequests',
  components: {
    Loader
  },
  data: () => ({
    users: [],
    pagination: {
      limit: 10,
      page: 1
    }
  }),
  async created () {
    await this.fetchPullRequests()
  },
  mounted () {
    if (!observer) {
      observer = new IntersectionObserver(observerCallBack, { root: null })
    }
    this.$refs.pageBottom.$el.$notifyInView = async () => {
      this.pagination.page++
      await this.fetchPullRequests()
    }
    observer.observe(this.$refs.pageBottom.$el)
  },
  methods: {
    slicePRs (user) {
      let end = 2
      if (user.hover) end = user.pullRequests.length
      return user.pullRequests.slice(0, end)
    },
    setHover (index, val) {
      this.$set(this.users[index], 'hover', val)
    },
    async fetchPullRequests () {
      try {
        const { page, limit } = this.pagination
        let result = await api.getPulls(2019, {
          page,
          limit
        })
        this.users.push(...result.data)
      } catch (error) {
        // eslint-disable-next-line
        console.log(error)
      }
    },
    svgMedal (index) {
      if (index === 0) {
        return '003-gold-medal.svg'
      }
      if (index === 1) {
        return '001-silver-medal.svg'
      }
      if (index === 2) {
        return '002-bronze-medal.svg'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-pull-request {
  padding: 0 10px;
}

.pr-content {
  position: relative;
}

.medal {
  position: absolute;
  right: 0;
  width: 40px;
  height: 40px;
  top: 0px;
  z-index: 9999999999;
  display: block;
}

.hover-effect {
  background-image: url('../assets/hdefault.svg');
  position: absolute;
  width: 100px;
  background-size: cover;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30px;
  transform: translate(-120px, 0px);
  transition: 0.3s;
}

.pr-rank-outter {
  display: flex;
  align-items: center;
}

.pr-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin: 15px 0;
}

.pr-item {
  &:nth-child(1) {
    .hover-effect {
      background-image: url('../assets/hgold.svg');
    }
  }
  &:nth-child(2) {
    .hover-effect {
      background-image: url('../assets/hsilver.svg');
    }
  }
  &:nth-child(3) {
    .hover-effect {
      background-image: url('../assets/hbronze.svg');
    }
  }
  box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 5px;
  margin: 20px 0;
  background-color: #1d2c4e;
  position: relative;
  overflow: hidden;
}

.pr-username {
  color: #e6009a;
  font-weight: bold;
  font-size: 17px;
  width: 30%;
}

.pr-rank {
  font-size: 50px;
  color: #c0c0c0;
}

.pr-links {
  width: 50%;
}

.pr-li {
  text-align: left;
}

.pr-link {
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  transition: 0.3s;
  &:hover {
    color: #5392fb;
  }
}

@media screen and (min-width: 768px) {
  .list-pull-request {
    text-align: center;
    width: 100%;
  }

  .pr-title {
    font-size: 28px;
  }

  .pr-list {
    margin-top: 30px;
    .pr-item {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
      align-items: center;
      width: 50%;
      background-color: #1d2c4e;
      text-overflow: ellipsis;
      margin: 20px auto 20px auto;

      &:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        transform: scale(1.04, 1.04);
        margin: 30px auto;
        .hover-effect {
          transform: translate(-1px, 0px);
        }
      }
    }

    .pr-content {
      padding: 10px;
      list-style-type: none;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
