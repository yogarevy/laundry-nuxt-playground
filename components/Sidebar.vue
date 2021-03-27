<template>
  <div>
    <transition name="slide-fade">
      <nav v-if="isSlideToggle" id="sidebar">
        <ul class="list-unstyled components accordion" role="tablist">
          <li>
            <NuxtLink to="/dashboard" exact>
              <font-awesome-icon icon="tachometer-alt" /> Dashboard
            </NuxtLink>
          </li>
          <li>
            <a
              v-b-toggle.collapse-b
              href="javascript:void(0)"
              class="expand-class"
            >
              <font-awesome-icon icon="users" /> Customers Management
              <span class="when-opened float-right">
                <font-awesome-icon icon="chevron-down" />
              </span>
              <span class="when-closed float-right">
                <font-awesome-icon icon="chevron-right" />
              </span>
            </a>
            <b-collapse
              id="collapse-b"
              class="mt-2 list-unstyled"
              accordion="my-accordion"
              role="tabpanel"
            >
              <ul class="list-unstyled">
                <li>
                  <NuxtLink to="/customer" exact>
                    <font-awesome-icon icon="dot-circle" /> Customer
                  </NuxtLink>
                </li>
              </ul>
            </b-collapse>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Sidebar',
  computed: {
    ...mapState(['isSlideToggle']),
  },
}
</script>

<style>
p {
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

#sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  height: 100vh;
  z-index: 100;
  background: #fff;
  color: #35495e;
  transition: all 0.3s;
  border-right: solid 1px #ddd;
}

#sidebar.active {
  margin-left: -250px;
}

#sidebar ul.components {
  padding: 20px 0;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li a {
  padding: 12px;
  font-size: 1em;
  display: block;
  border-bottom: solid 1px #ddd;
}
#sidebar ul li a:hover {
  color: #35495e;
  background: #ddd;
}

#sidebar ul li.active > a,
.expand-class[aria-expanded='true'] {
  color: #35495e;
  background: #ddd;
}
ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #fff;
}

/* Animasi Masuk dan Keluar bisa menggunakan fungsi */
/* durasi dan pengaturan waktu yang berbeda.        */
/* .slide-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.8s ease-in-out;
} */
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active di bawah versi 2.1.8 */ {
  transform: translateX(-100%);
}

.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}

.nuxt-link-active {
  font-weight: bold;
}

@media (max-width: 768px) {
  #sidebar {
    margin-left: -250px;
  }
  #sidebar.active {
    margin-left: 0;
  }
}
</style>
