module.exports = {
    theme: {
      extend: {
        keyframes: {
          slideInUp: {
            '0%': { transform: 'translateY(100px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          messageSlideIn: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        animation: {
          slideInUp: 'slideInUp 0.3s ease-out',
          fadeIn: 'fadeIn 0.3s ease-out',
          messageSlideIn: 'messageSlideIn 0.3s ease-out',
        },
      },
    },
  };