import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface MenuNode {
  id: string;
  title: string;
  link: string;
  component: string;
  description: string;
  children?: MenuNode[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly menuTree: MenuNode[] = [
    {
      id: 'account',
      title: 'Account',
      link: '/account',
      component: 'AccountComponent',
      description: 'Manage your personal account information, subscriptions and preferences.',
      children: [
        {
          id: 'profile',
          title: 'Profile',
          link: '/account/profile',
          component: 'ProfileComponent',
          description: 'Edit your personal profile and public information.',
        },
        {
          id: 'security',
          title: 'Security & Privacy',
          link: '/account/security',
          component: 'SecurityComponent',
          description: 'Configure the security options of your account.',
          children: [
            {
              id: 'password',
              title: 'Password',
              link: '/account/security/password',
              component: 'PasswordComponent',
              description: 'Change your password and enable security recommendations.',
            },
            {
              id: 'notification',
              title: 'Notification',
              link: '/account/security/notification',
              component: 'NotificationComponent',
              description: 'Manage email and push alerts for your account.',
            },
          ],
        },
      ],
    },
    {
      id: 'messages',
      title: 'Messages',
      link: '/messages',
      component: 'MessagesComponent',
      description: 'Check your inbox and direct conversations.',
    },
    {
      id: 'settings',
      title: 'Settings',
      link: '/settings',
      component: 'SettingsComponent',
      description: 'Set your preferences and adjust system configuration.',
    },
    {
      id: 'help',
      title: 'Help',
      link: '/help',
      component: 'HelpComponent',
      description: 'Access support options and useful references.',
      children: [
        {
          id: 'faq',
          title: 'FAQ',
          link: '/help/faq',
          component: 'FaqComponent',
          description: 'Find answers to the most common questions.',
        },
        {
          id: 'submit-ticket',
          title: 'Submit a Ticket',
          link: '/help/ticket',
          component: 'TicketComponent',
          description: 'Send a support request to the team.',
        },
      ],
    },
    {
      id: 'network',
      title: 'Network Status',
      link: '/network',
      component: 'NetworkStatusComponent',
      description: 'Review the current connectivity and service status.',
    },
    {
      id: 'logout',
      title: 'Logout',
      link: '/logout',
      component: 'LogoutComponent',
      description: 'Close the current session safely.',
    },
  ];

  selectedId = 'password';

  get selectedNode(): MenuNode {
    return this.findNode(this.menuTree, this.selectedId) ?? this.menuTree[0];
  }

  selectNode(node: MenuNode): void {
    this.selectedId = node.id;
  }

  private findNode(nodes: MenuNode[], id: string): MenuNode | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children) {
        const child = this.findNode(node.children, id);
        if (child) {
          return child;
        }
      }
    }

    return undefined;
  }
}
