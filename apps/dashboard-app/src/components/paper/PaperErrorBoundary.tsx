'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, Button, Stack } from '@mantine/core';
import * as Sentry from '@sentry/nextjs';

type Props = { children: ReactNode; paperId?: string };

type State = { hasError: boolean };

export class PaperErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		Sentry.captureException(error, {
			tags: { paper_error_boundary: 'paper' },
			extra: { paperId: this.props.paperId, componentStack: errorInfo.componentStack }
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<Stack p='xl' align='center'>
					<Text>Something went wrong loading this paper view.</Text>
					<Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
				</Stack>
			);
		}
		return this.props.children;
	}
}
