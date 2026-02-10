import { useQuery } from '@tanstack/react-query';
import { List, Card, Typography, Spin, Empty, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getAllProducts } from '../api/product';

const { Text } = Typography;

const HomePage = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {products && products.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
          dataSource={products}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.name}
                    src={item.thumbnail || 'https://via.placeholder.com/200'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button type="primary" icon={<ShoppingCartOutlined />}>
                    Add to cart
                  </Button>
                ]}
              >
                <Card.Meta
                  title={item.name}
                  description={
                    <div>
                      <Text type="danger" strong style={{ fontSize: '16px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Don't have any products yet" />
      )}
    </div>
  );
};

export default HomePage;