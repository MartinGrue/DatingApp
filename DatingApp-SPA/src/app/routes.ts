import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PrecentUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolver/lists.resolver';
import { MessageResolver } from './_resolver/messages.resolver';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '', // nothing/mebers oder /nothing/message --> /members oder /message
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      // the  users in {users: MemberListResolver} defines the variable name
      // for acces the resolver data later with this.route.subscribe(
      // data => {data['user']}

      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver }
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver }
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PrecentUnsavedChanges]
      },
      {
        path: 'messages',
        component: MessagesComponent,
        resolve: { messages: MessageResolver }
      },
      {
        path: 'lists',
        component: ListsComponent,
        resolve: { users: ListResolver }
      }
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
