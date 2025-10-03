import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

function TopNav() {
  const navItems = [
    { path: '/', icon: 'Calendar', label: 'Today' },
    { path: '/calendar', icon: 'CalendarDays', label: 'Calendar' },
    { path: '/insights', icon: 'TrendingUp', label: 'Insights' },
    { path: '/profile', icon: 'User', label: 'Profile' },
    { path: '/customizations', icon: 'Settings', label: 'Customizations' }
  ];

  return (
    <nav className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ApperIcon name="Moon" size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary">Luna Cycle</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                    'hover:bg-primary/10',
                    isActive
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-gray-600 hover:text-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={isActive ? 'text-primary' : 'text-gray-600'}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;