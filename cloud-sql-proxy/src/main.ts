import * as core from '@actions/core';
import { spawn } from 'child_process';
import * as setupGcloud from '../../setupGcloudSDK/dist/index';
import { getCredentials } from './credentials';

/**
 * Executes the main action. It includes the main business logic and is the
 * primary entry point. It is documented inline.
 */
async function run(): Promise<void> {
  try {
    // Retrieve input.
    const instanceConnectionName = core.getInput('instance_connection_name');
    const port = core.getInput('port');
    const credentials = getCredentials();
    const privateKey = credentials.private_key;

    // Install gcloud if not already installed.
    if (!setupGcloud.isInstalled()) {
      const gcloudVersion = await setupGcloud.getLatestGcloudSDKVersion();
      await setupGcloud.installGcloudSDK(gcloudVersion);
    }

    // If not already authenticated, try to authenticate with provided credentials.
    let authenticated = await setupGcloud.isAuthenticated();
    if (!authenticated) {
      // Authenticate gcloud SDK.
      if (privateKey) {
        await setupGcloud.authenticateGcloudSDK(privateKey);
      } else {
        core.setFailed('Not authenticated and no credentials provided.');
      }
    }

    authenticated = await setupGcloud.isAuthenticated();
    if (!authenticated) {
      core.setFailed('Error authenticating the Cloud SDK.');
    }

    console.log(process.cwd());

    const child = spawn(
      '../lib/cloud_sql_proxy',
      [`-instances=${instanceConnectionName}=tcp:${port}`],
      {
        detached: true,
        stdio: 'inherit',
      },
    );
    child.unref();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
