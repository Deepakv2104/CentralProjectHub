// webpack.config.js
const path = require('path');

module.exports = {
  // ... other webpack configuration

  module: {
    rules: [
      {
        test: /\.(csv)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/csv/',
            },
          },
        ],
      },
    ],
  },
};
