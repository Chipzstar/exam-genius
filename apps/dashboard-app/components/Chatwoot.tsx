'use client';

import { useUser } from '@clerk/nextjs';
import type React from 'react';
import { useEffect } from 'react';

interface Props {
    token?: string;
}

const ChatwootWidget: React.FC<Props> = ({ token = 'BApecBTbBSMMxfBex5PvEtT1' }: Props) => {
    const { user } = useUser();

    useEffect(() => {
        if (user && window.$chatwoot) {
            (window as any).$chatwoot.setUser(user.id, {
                name: user.fullName, // Name of the user
                avatar_url: user.imageUrl, // Avatar URL
                email: user.emailAddresses[0]?.emailAddress ?? '', // Email of the user
                identifier_hash: '' // Identifier Hash generated based on the webwidget hmac_token
            });
        }
    }, [user]);

    useEffect(() => {
        // Add Chatwoot Settings
        (window as any).chatwootSettings = {
            hideMessageBubble: true,
            position: 'right', // This can be left or right
            locale: 'en', // Language to be set
            type: 'standard', // [standard, expanded_bubble]
            launcherTitle: 'Send us your feedback!'
        };

        // Paste the script from inbox settings except the <script> tag
        (function (d, t) {
            var BASE_URL = 'https://app.chatwoot.com';
            var g = d.createElement(t),
                s = d.getElementsByTagName(t)[0];
            g.src = BASE_URL + '/packs/js/sdk.js';
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);
            g.onload = function () {
                (window as any).chatwootSDK.run({
                    websiteToken: token,
                    baseUrl: BASE_URL
                });
            };
        })(document, 'script');
    }, []); // An empty array means that this effect will run once when the component mounts.

    return null;
};

export default ChatwootWidget;
