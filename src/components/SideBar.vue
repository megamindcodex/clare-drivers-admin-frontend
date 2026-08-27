<script setup>
import { useRoute } from 'vue-router'
import SidebarLayout from 'primevue/sidebarlayout'
import Sidebar from 'primevue/sidebar'
import SidebarSpacer from 'primevue/sidebarspacer'
import SidebarAside from 'primevue/sidebaraside'
import SidebarPanel from 'primevue/sidebarpanel'
import SidebarHeader from 'primevue/sidebarheader'
import SidebarContent from 'primevue/sidebarcontent'
import SidebarFooter from 'primevue/sidebarfooter'
import SidebarGroup from 'primevue/sidebargroup'
import SidebarGroupContent from 'primevue/sidebargroupcontent'
import SidebarMenu from 'primevue/sidebarmenu'
import SidebarMenuItem from 'primevue/sidebarmenuitem'
import SidebarMenuButton from 'primevue/sidebarmenubutton'
import SidebarMain from 'primevue/sidebarmain'
import { IconOverView, IconAdmin, IconActiveDrivers, IconDrivers } from '@/components/icons'

const route = useRoute()

const navItems = [
  { name: 'Overview', path: '/', matches: ['overview'], icon: IconOverView },
  { name: 'Admins', path: '/admins', matches: ['admins'], icon: IconAdmin },
  {
    name: 'Drivers',
    path: '/drivers',
    matches: ['drivers', 'driver-detail'],
    icon: IconDrivers,
  },
  {
    name: 'Active Drivers',
    path: '/drivers/active',
    matches: ['active-drivers', 'active-driver-detail'],
    icon: IconActiveDrivers,
  },
]

const isActive = (item) => item.matches.includes(route.name)
</script>

<template>
  <div
    class="border border-surface-500 rounded-lg max-w-screen-lg mx-auto flex alin-items-stretch h-[calc(100vh-4rem)]"
  >
    <SidebarLayout>
      <Sidebar id="main">
        <SidebarSpacer />
        <SidebarAside>
          <SidebarPanel>
            <SidebarHeader>
              <span class="text-lg font-semibold">Clare Drivers Admin</span>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem v-for="item in navItems" :key="item.path">
                      <!--
                        SidebarMenuButton is headless (renders a plain button by default, not a
                        real link). as-child tells it to skip its own root element and instead
                        hand its styling (buttonClass) and a11y/data attrs (a11yAttrs, incl. the
                        active-state highlighting from is-active) to this slot, so we can apply
                        them onto an actual RouterLink that Vue Router can navigate.
                      -->
                      <SidebarMenuButton as-child :is-active="isActive(item)">
                        <template #default="{ class: buttonClass, a11yAttrs }">
                          <RouterLink :to="item.path" :class="buttonClass" v-bind="a11yAttrs">
                            <component :is="item.icon" v-if="item.icon" />
                            <span class="font-semibold">{{ item.name }}</span>
                          </RouterLink>
                        </template>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
          </SidebarPanel>
        </SidebarAside>
      </Sidebar>

      <SidebarMain>
        <RouterView />
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

