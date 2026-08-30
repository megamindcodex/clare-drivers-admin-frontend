<script setup>
import { computed } from 'vue'
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
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import {
  IconOverView,
  IconAdmin,
  IconActiveDrivers,
  IconDrivers,
  IconMenu,
} from '@/components/icons'

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

const currentPageName = computed(
  () => navItems.find((item) => item.matches.includes(route.name))?.name ?? '',
)
</script>

<template>
  <div
    class="border border-surface-500 rounded-lg max-w-screen-lg mx-auto flex alin-items-stretch h-screen overflow-hidden"
  >
    <SidebarLayout class="min-h-0">
      <Sidebar id="side-bar">
        <!--
          SidebarSpacer reserves horizontal space in the flex row for SidebarAside, which is
          itself position:absolute and so doesn't take up flow space on its own. Hiding
          SidebarAside on small screens (above) doesn't shrink this reserved gap — same
          unlayered-PrimeVue-vs-layered-Tailwind cascade issue as SidebarAside's `!hidden`, fixed
          the same way: `max-md:!w-0` collapses the reserved width below the `md` breakpoint so
          SidebarMain's `flex-1` can claim the full row width.
        -->
        <SidebarSpacer class="max-md:!w-0" />
        <!--
          Plain `hidden` doesn't work here: PrimeVue injects `.p-sidebar-aside { display: flex }`
          as an unlayered <style> tag, while Tailwind v4 generates its utilities inside
          `@layer utilities`. Per the CSS cascade, unlayered styles always win over layered ones
          regardless of specificity or source order, so `.hidden` was silently losing. The `!`
          important-modifier (`!hidden` / `md:!flex`) sidesteps that: importance is checked before
          layers, so it reliably overrides PrimeVue's plain `display: flex` either way.
        -->
        <SidebarAside class="!hidden md:!flex">
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

      <SidebarMain class="min-h-0 overflow-y-auto">
        <Toolbar>
          <template #start>
            <span class="text-lg font-semibold md:hidden">Clare Drivers Admin</span>
            <span class="hidden md:inline text-lg font-semibold">{{ currentPageName }}</span>
          </template>

          <template #end>
            <!-- TODO: wire up to open the nav drawer on small screens — drawer not built yet -->
            <!--
              md:!hidden (not plain md:hidden): PrimeVue's .p-button sets display:inline-flex as
              an unlayered style, same conflict as SidebarAside/SidebarSpacer above — needs
              importance to reliably win at the md breakpoint.
            -->
            <Button text rounded aria-label="Menu" class="md:!hidden">
              <IconMenu />
            </Button>
          </template>
        </Toolbar>

        <RouterView />
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

